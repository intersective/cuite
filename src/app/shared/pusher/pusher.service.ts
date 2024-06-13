import { Injectable, Optional, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpParameterCodec } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { RequestService } from '@shared/request/request.service';
import { environment } from '@environments/environment';
import { UtilsService } from '@services/utils.service';
import { StorageService } from '@services/storage.service';
import Pusher, { Channel } from 'pusher-js';
import * as PusherLib from 'pusher-js';
import { urlFormatter } from 'helper';
import { ApolloService } from '@shared/apollo/apollo.service';

const api = {
  pusherAuth: '/pusher_auth',
  channels: 'api/v2/message/notify/channels.json'
};

export interface SendMessageParam {
  channelUuid:  string;
  uuid: string;
  message: string;
  file: string;
  isSender: boolean;
  created: string;
  senderUuid: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  sentAt: string;
}

export interface DeleteMessageTriggerParam {
  channelUuid:  string;
  uuid: string;
}

export class PusherConfig {
  pusherKey = '';
  apiurl = '';
}

class PusherChannel {
  name: string;
  subscription?: Channel;
}

@Injectable({
  providedIn: 'root',
})

export class PusherService {
  private pusherKey: string;
  private apiurl: string;
  private pusher: Pusher;
  private channels: {
    notification: PusherChannel;
    chat: PusherChannel[];
  } = {
    notification: null,
    chat: []
  };

  constructor(
    private http: HttpClient,
    @Optional() config: PusherConfig,
    private request: RequestService,
    private utils: UtilsService,
    public storage: StorageService,
    private ngZone: NgZone,
    private apollo: ApolloService,
  ) {
    this.pusherKey = environment.pusherKey;
    this.apiurl = environment.graphQL;
  }

  // initialise + subscribe to channels at one go
  async initialise(options?: {
    unsubscribe?: boolean;
  }) {
    // make sure pusher is connected
    if (!this.pusher) {
      this.pusher = await this.initialisePusher();
    }
    if (!this.pusher) {
      return {};
    }
    if (options && options.unsubscribe) {
      this.unsubscribeChannels();
    }
    // handling condition at re-login without rebuilding pusher (where isInstantiated() is false)
    if (this.pusher.connection.state !== 'connected') {
      // reconnect pusher
      this.pusher.connect();
    }

    // subscribe to event only when pusher is available
    const channels = this.getChannels();
    return {
      pusher: this.pusher,
      channels
    };
  }

  disconnect(): void {
    if (this.pusher) {
      return this.pusher.disconnect();
    }
    return;
  }

  // check if pusher has been instantiated correctly
  isInstantiated(): boolean {
    if (this.utils.isEmpty(this.pusher)) {
      return false;
    }

    if (this.pusher.connection.state === 'disconnected') {
      return false;
    }

    return true;
  }

  private async initialisePusher(): Promise<Pusher> {
    // during the app execution lifecycle
    if (typeof this.pusher !== 'undefined') {
      return this.pusher;
    }
    // prevent pusher auth before user authenticated (skip silently)
    const { apikey, timelineId } = this.storage.getUser();
    if (!apikey || !timelineId) {
      return this.pusher;
    }
    // never reinstantiate another instance of Pusher
    if (!this.utils.isEmpty(this.pusher)) {
      return this.pusher;
    }
    try {
      const config = {
        cluster: environment.pusherCluster,
        forceTLS: true,
        authEndpoint: this.apiurl + api.pusherAuth,
        auth: {
          headers: {
            'Authorization': 'pusherKey=' + this.pusherKey,
            'appkey': environment.appkey,
            'apikey': apikey,
            'timelineid': timelineId
          },
        },
      };
      const newPusherInstance = await new Pusher(this.pusherKey, config);
      return newPusherInstance;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * check if every channel has been subscribed properly
   * true: subscribed
   * false: haven't subscribed
   */
  isSubscribed(channelName): boolean {
    return !!this.pusher.allChannels().find((channel: Channel) => channel.name === channelName && channel.subscribed);
  }

  /**
   * get a list of channels from API request and subscribe every of them into
   * connected + authorised pusher
   */
   async getChannels() {
    if (environment.demo) {
      return;
    }
    await this.getNotificationChannel().toPromise();
    await this.getChatChannels().toPromise();
  }

  getNotificationChannel(): Observable<any> {
    return this.request.get(api.channels, {
      params: {
        env: environment.env,
        for: 'notification'
      }
    }).pipe(map(response => {
      if (response.data) {
        this.subscribeChannel('notification', response.data[0].channel);
      }
    }));
  }

  getChatChannels(): Observable<any> {
    return this.apollo.chatGraphQLQuery(
      `query getPusherChannels {
        channels {
          pusherChannel
        }
      }`
    ).pipe(map((response: any) => {
      if (response.data && response.data.channels) {
        const result = JSON.parse(JSON.stringify(response.data.channels));
        result.forEach(element => {
          this.subscribeChannel('chat', element.pusherChannel);
        });
      }
    }));
  }

  /**
   * unsubscribe all channels
   * (use case: after switching program)
   */
  unsubscribeChannels(): void {
    if (!this.channels.notification) {
      return ;
    }
    this.channels.notification.subscription.unbind_all();
    // handle issue logout at first load of program-switching view
    if (this.pusher) {
      this.pusher.unbind_all();
      this.pusher.unsubscribe(this.channels.notification.name);
    }
    this.channels.chat.forEach(chat => {
      chat.subscription.unbind_all();
      if (this.pusher) {
        this.pusher.unsubscribe(chat.name);
      }
    });
    this.channels.notification = null;
    this.channels.chat = [];
  }

  /**
   * Subscribe a Pusher channel
   * @param type        The type of Pusher channel (notification/chat)
   * @param channelName The name of the Pusher channel
   */
  subscribeChannel(type: string, channelName: string) {
    if (!channelName) {
      return false;
    }
    if (this.isSubscribed(channelName)) {
      return;
    }
    switch (type) {
      case 'notification':
        this.channels.notification = {
          name: channelName,
          subscription: this.pusher.subscribe(channelName)
        };
        this.channels.notification.subscription
          .bind('notification', data => {
            this.utils.broadcastEvent('notification', data);
          })
          .bind('achievement', data => {
            this.utils.broadcastEvent('achievement', data);
          })
          .bind('event-reminder', data => {
            this.utils.broadcastEvent('event-reminder', data);
          })
          .bind('pusher:subscription_succeeded', data => {
          })
          .bind('pusher:subscription_error', data => {
            // error handling
          });
        break;
      case 'chat':
        // don't need to subscribe again if already subscribed
        if (this.channels.chat.find(c => c.name === channelName)) {
          return;
        }
        const channel = {
          name: channelName,
          subscription: this.pusher.subscribe(channelName)
        };
        channel.subscription
        .bind('client-chat-new-message', data => {
          this.utils.broadcastEvent('chat:new-message', data);
        })
        .bind('client-chat-delete-message', data => {
          this.utils.broadcastEvent('chat:delete-message', data);
        })
        .bind('client-chat-edit-message', data => {
          this.utils.broadcastEvent('chat:edit-message', data);
        })
        .bind('client-chat-delete-shedule-message', data => {
          this.utils.broadcastEvent('chat:delete-shedule-message', data);
        })
        .bind('client-chat-edit-shedule-message', data => {
          this.utils.broadcastEvent('chat:edit-shedule-message', data);
        })
        .bind('client-typing-event', data => {
          this.utils.broadcastEvent('typing-' + channelName, data);
        })
        .bind('pusher:subscription_succeeded', data => {
        })
        .bind('pusher:subscription_error', data => {
          // error handling
        });
        if (!this.channels.chat) {
          this.channels.chat = [];
        }
        this.channels.chat.push(channel);
        break;
    }
  }

  /**
   * When the current user start typing, send notification to the Pusher channel
   * from pusher doc
   * - A client event must have a name prefixed with 'client'- or it will be rejected by the server.
   * - Client events can only be triggered on 'private' and 'presence' channels because they require authentication
   * - private channel name start with 'private-' and presence channel name start with 'presence-'
   */
  triggerTyping(channelName): void {
    const channel = this.channels.chat.find(c => c.name === channelName);
    if (!channel) {
      return;
    }
    channel.subscription.trigger('client-typing-event', {
      user: this.storage.getUser().name
    });
  }

    /**
   * This method triggering 'client-chat-new-message' event of a pusher channel to send message to other members
   * that subscribe to the pusher channel.
   * when user send message it will save in api first and then call this.
   * @param channelName pusher channel name that need to trigger the event on
   * @param data send message object
   */
  triggerSendMessage(channelName: string, data: SendMessageParam) {
    const channel = this.channels.chat.find(c => c.name === channelName);
    if (!channel) {
      return;
    }
    channel.subscription.trigger('client-chat-new-message', data);
  }

  triggerDeleteMessage(channelName: string, isSchedule: boolean, data: DeleteMessageTriggerParam) {
    const channel = this.channels.chat.find(c => c.name === channelName);
    if (!channel) {
      return;
    }
    if (isSchedule) {
      channel.subscription.trigger('client-chat-delete-shedule-message', data);
    } else {
      channel.subscription.trigger('client-chat-delete-message', data);
    }
  }

  triggerEditMessage(channelName: string, isSchedule: boolean, data: SendMessageParam) {
    const channel = this.channels.chat.find(c => c.name === channelName);
    if (!channel) {
      return;
    }
    if (isSchedule) {
      channel.subscription.trigger('client-chat-edit-shedule-message', data);
    } else {
      channel.subscription.trigger('client-chat-edit-message', data);
    }
  }

}
