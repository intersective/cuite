import { Injectable } from '@angular/core';
import { RequestService } from '@shared/request/request.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UtilsService } from '@services/utils.service';
import { PusherService } from '@shared/pusher/pusher.service';
import { environment } from '@environments/environment';
import { DemoService } from '@services/demo.service';
import { delay } from 'rxjs/internal/operators';

/**
 * @description list of api endpoint involved in this service
 */
const api = {
  getChatList: 'api/v2/message/chat/list.json',
  getChatMessages: 'api/v2/message/chat/list_messages.json',
  createMessage: 'api/v2/message/chat/create_message',
  markAsSeen: 'api/v2/message/chat/edit_message',
  getTeam: 'api/teams.json'
};

export interface ChatListObject {
  team_id: number;
  team_name: string;
  team_member_id?: number;
  channel_id: number;
  name: string;
  role?: string;
  unread_messages?: number;
  last_message_created?: string;
  last_message?: string;
  is_team: boolean;
  participants_only: boolean;
  team_member_image: string;
}

export interface ChatRoomObject {
  name: string;
  team_name?: string;
  is_team?: boolean;
  team_id: number;
  team_member_id: number;
  participants_only?: boolean;
  channel_id: number;
}

export interface Message {
  id?: number;
  sender_name?: string;
  receiver_name?: string;
  message?: string;
  sent_time?: string;
  is_sender?: boolean;
  noAvatar?: boolean;
  file?: object;
  preview?: string;
  sender_image: string;
  sender_role: string;
}
interface NewMessage {
  to: number | string;
  message: string;
  team_id: number;
  env?: string;
  participants_only?: boolean;
  file?: object;
  channel_id: number;
}

interface MessageListPrams {
  team_id: number;
  team_member_id?: number;
  page: number;
  size: number;
  participants_only?: boolean;
  channel_id: number;
  sender_role: string;
}

interface MarkAsSeenPrams {
  team_id: number;
  id: string | number;
  action?: string;
}

interface UnreadMessagePrams {
  filter: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private request: RequestService,
    private utils: UtilsService,
    private pusherService: PusherService,
    private demo: DemoService
  ) {}

  /**
   * this method return chat list data.
   */
  getchatList(): Observable<any> {
    if (environment.demo) {
      const response = this.demo.getChats();
      return of(this._normaliseeChatListResponse(response.data)).pipe(delay(1000));
    }
    return this.request.get(api.getChatList).pipe(
      map(response => {
        if (response.success && response.data) {
          return this._normaliseeChatListResponse(response.data);
        }
      })
    );
  }

  /**
   * this method return message for one chat.
   * @param prams
   *  prams is a json object
   * {
   *  team_id: 1234,
   *  team_member_id: 4567,
   *  page: 1,
   *  size:20
   * }
   */
  getMessageList(data: MessageListPrams): Observable<any> {
    if (environment.demo) {
      const response = this.demo.getMessages(data);
      return of(this._normaliseeMessageListResponse(response.data)).pipe(delay(1000));
    }
    return this.request
      .get(api.getChatMessages, {
        params: data
      })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this._normaliseeMessageListResponse(
              response.data
            );
          }
        })
      );
  }

  markMessagesAsSeen(prams: MarkAsSeenPrams): Observable<any> {
    const body = {
      team_id: prams.team_id,
      id: prams.id,
      action: 'mark_seen'
    };
    return this.request.post(api.markAsSeen, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  /**
  //  * @name postNewMessage
   * @description post new text message (with text) or attachment (with file)
   */
  postNewMessage(data: NewMessage): Observable<any> {
    const reqData = {
      to: data.to,
      message: data.message,
      team_id: data.team_id,
      env: environment.env,
      participants_only: '',
      file: data.file,
    };
    if (data.participants_only) {
      reqData.participants_only = data.participants_only.toString();
    } else {
      delete reqData.participants_only;
    }
    return this.request.post(api.createMessage, reqData);
  }

  postAttachmentMessage(data: NewMessage): Observable<any> {
    if (!data.file) {
      throw new Error('Fatal: File value must not be empty.');
    }
    return this.postNewMessage(data);
  }

  unreadMessageCout(data: UnreadMessagePrams): Observable<any> {
    const body = {
      unread_count_for: data.filter
    };
    return this.request.get(api.getChatMessages, body);
  }

  getTeamName(id: number): Observable<any> {
    if (environment.demo) {
      const response = this.demo.getTeamsForChat();
      return of(this._normaliseTeamResponse(response.data)).pipe(delay(1000));
    }
    const data = {
      team_id: id
    };
    return this.request
      .get(api.getTeam, {
        params: data
      })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this._normaliseTeamResponse(response.data);
          }
        })
      );
  }

  /**
   * @description listen to pusher event from new/incoming message
   */
  getMessageFromEvent(data): Message | null {
    // const presenceChannelId = this.pusherService.getMyPresenceChannelId();
    // // don't show the message if it is from the current user,
    // // or it is not to this user and not a team message
    // if ((presenceChannelId === data.event.from) ||
    //     (presenceChannelId !== data.event.to && data.event.to !== 'team')
    //   ) {
    //   return null;
    // }
    // // show the message if it is team message, and participants_only match
    // // or it is individual message and sender match
    // if (!(
    //       (data.isTeam && data.event.to === 'team' &&
    //         data.participants_only === data.event.participants_only) ||
    //       (data.event.sender_name === data.chatName &&
    //         data.event.to !== 'team')
    //   )) {
    //   return null;
    // }
    // const message = {
    //   id: data.event.id,
    //   is_sender: data.event.is_sender,
    //   message: data.event.message,
    //   sender_name: data.event.sender_name,
    //   sent_time: data.event.sent_time,
    //   file: data.event.file,
    //   sender_image: data.event.sender_image
    // };
    // return message;
    return null;
  }

  private _normaliseTeamResponse(data) {
    if (!this.utils.has(data, 'Team')) {
      return this.request.apiResponseFormatError('Team format error');
    }
    return data.Team.name;
  }

  /**
   * modify the Chat list response
   *  - set chat avatar color
   *  - set chat name
  //  * @param {Array} response
   */
  private _normaliseeChatListResponse(data) {
    console.log('_normaliseeChatListResponse', data);
    if (!Array.isArray(data)) {
      return this.request.apiResponseFormatError('Chat format error');
    }
    if (data.length === 0) {
      return [];
    }
    const chats = [];
    data.forEach(chat => {
      if (!this.utils.has(chat, 'team_id') ||
          !this.utils.has(chat, 'is_team') ||
          !this.utils.has(chat, 'participants_only') ||
          !this.utils.has(chat, 'name') ||
          !this.utils.has(chat, 'team_name')
        ) {
        return this.request.apiResponseFormatError('Chat object format error');
      }
      chat.name = this._getChatName(chat);
      chats.push(chat);
    });
    return chats;
  }

  private _getChatName(chat) {
    if (!chat.is_team) {
      return chat.name;
    }
    if (chat.participants_only) {
      return chat.team_name;
    } else {
      return chat.team_name + ' + Mentor';
    }
  }

  /**
   * modify the message list response
   */
  private _normaliseeMessageListResponse(data) {
    console.log('_normaliseeMessageListResponse', data);
    if (!Array.isArray(data)) {
      return this.request.apiResponseFormatError('Message array format error');
    }
    if (data.length === 0) {
      return [];
    }
    const messageList = [];
    data.forEach(message => {
      if (!this.utils.has(message, 'id') ||
          !this.utils.has(message, 'sender_name') ||
          !this.utils.has(message, 'receiver_name') ||
          !this.utils.has(message, 'message') ||
          !this.utils.has(message, 'is_sender')) {
        return this.request.apiResponseFormatError('Message format error');
      }
      messageList.push(message);
    });
    return messageList;
  }
}
