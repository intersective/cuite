import { Injectable } from '@angular/core';
import { RequestService } from '@shared/request/request.service';
import { ApolloService } from '@shared/apollo/apollo.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UtilsService } from '@services/utils.service';
import { PusherService } from '@shared/pusher/pusher.service';
import { environment } from '@environments/environment';
import { DemoService } from '@services/demo.service';
import { delay } from 'rxjs';
import { StorageService } from '@services/storage.service';

export interface ChatChannel {
  uuid: string;
  name: string;
  avatar: string;
  targetUser?: TargetUser;
  isAnnouncement: boolean;
  isDirectMessage: boolean;
  pusherChannel: string;
  readonly: boolean;
  roles: string[];
  unreadMessageCount: number;
  lastMessage: string;
  lastMessageCreated: string;
  canEdit: boolean;
  scheduledMessageCount: number;
}

export interface TargetUser {
  email: string;
  role: string;
  teamName: string;
}

export interface ChannelMembers {
  uuid: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
}

export interface Message {
  uuid: string;
  senderUuid?: string;
  senderName?: string;
  senderRole?: string;
  senderAvatar?: string;
  isSender: boolean;
  message: string;
  created: string;
  file: string;
  fileObject?: {
    filename: string;
    mimetype: string;
  };
  preview?: string;
  noAvatar?: boolean;
  channelUuid?: string;
  scheduled?: string;
  sentAt: string;
}

export interface MessageListResult {
  cursor: string;
  messages: Message[];
}

export interface NewChannelParam {
  name: string;
  isAnnouncement: boolean;
  roles: string[];
  members: {
    type: string;
    uuid: number | string;
  }[];
}

export interface EditMessageParam {
  uuid: string;
  message?: string;
  file?: string;
  scheduled?: string;
}

export interface User {
  uuid: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  enrolmentUuid: string;
  team: {
    uuid: string;
    name: string;
  };
}

export interface SearchUsersParam {
  scope: string;
  scopeUuid: string;
  filter: string;
  teamUserOnly: boolean;
}

export interface ChannelCreatePopupParam {
  learnerAnnouncement?: boolean;
  expertAnnouncement?: boolean;
  cohortChannel?: boolean;
}

interface NewMessageParam {
  channelUuid: string;
  message: string;
  file?: string;
  scheduled?: string;
}

interface MessageListParams {
  channelUuid: string;
  cursor: string;
  size: number;
  scheduledOnly?: boolean;
}

interface UnreadMessageParams {
  filter: string;
}

interface EditChannelParams {
  uuid: string;
  name?: string;
  isAnnouncement?: boolean;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private request: RequestService,
    private apollo: ApolloService,
    private utils: UtilsService,
    private pusherService: PusherService,
    private demo: DemoService,
    public storage: StorageService,
  ) { }

  /**
   * this method return chat list data.
   */
  getChatList(): Observable<ChatChannel[]> {
    if (environment.demo) {
      const response = this.demo.getChats();
      return of(this._normaliseChatListResponse(response.data)).pipe(delay(1000));
    }
    return this.apollo.chatGraphQLQuery(
      `query getChannels {
        channels{
          uuid
          name
          avatar
          targetUser {
            email
            role
            teamName
          }
          isAnnouncement
          isDirectMessage
          readonly
          roles
          unreadMessageCount
          lastMessage
          lastMessageCreated
          pusherChannel
          canEdit
          scheduledMessageCount
        }
      }`,
      {}
    ).pipe(map((response: any) => {
      if (response.data) {
        return this._normaliseChatListResponse(response.data);
      }
    }));
  }

  private _normaliseChatListResponse(data): ChatChannel[] {
    const result = JSON.parse(JSON.stringify(data.channels));
    if (!Array.isArray(result)) {
      this.request.apiResponseFormatError('Chat format error');
      return [];
    }
    if (result.length === 0) {
      return [];
    }
    return result.filter(c => c.name);
  }

  /**
   * this method return message for one chat.
   * @param prams
   *  prams is a json object
   * {
   *   channel_id: 1234,
   *   cursor: 1,
   *   size:20
   * }
   */
  getMessageList(data: MessageListParams): Observable<MessageListResult> {
    if (environment.demo) {
      const response = this.demo.getMessages(data);
      return of(this._normaliseMessageListResponse(response.data)).pipe(delay(1000));
    }
    const params = {
      uuid: data.channelUuid,
      cursor: data.cursor,
      size: data.size,
      scheduledOnly: data.scheduledOnly
    };
    if (!data.scheduledOnly) {
      delete params.scheduledOnly;
    }
    return this.apollo.chatGraphQLQuery(
      `query getChannellogs($uuid:String!, $cursor:String!, $size:Int!, $scheduledOnly:Boolean) {
        channel(uuid:$uuid){
          chatLogsConnection(cursor:$cursor, size:$size, scheduledOnly:$scheduledOnly){
            cursor
            chatLogs{
              uuid
              isSender
              message
              file
              created
              scheduled
              sentAt
              sender {
                uuid
                name
                role
                avatar
              }
            }
          }
        }
      }`, params
    ).pipe(map((response: any) => {
      if (response.data) {
        return this._normaliseMessageListResponse(response.data);
      }
    }));
  }

  /**
   * modify the message list response
   */
  private _normaliseMessageListResponse(data): MessageListResult {
    const messages = JSON.parse(JSON.stringify(data.channel.chatLogsConnection.chatLogs));
    const cursor = JSON.parse(JSON.stringify(data.channel.chatLogsConnection.cursor));
    if (!Array.isArray(messages)) {
      this.request.apiResponseFormatError('Message array format error');
      return null;
    }
    if (messages.length === 0) {
      return null;
    }
    const messageList = [];
    messages.forEach(message => {
      let fileObject = null;
      if ((typeof message.file) === 'string') {
        fileObject = JSON.parse(message.file);
        if (this.utils.isEmpty(fileObject)) {
          fileObject = null;
        }
      } else {
        fileObject = message.file;
      }
      messageList.push({
        uuid: message.uuid,
        isSender: message.isSender,
        message: message.message,
        file: message.file,
        fileObject: fileObject,
        created: message.created,
        senderUuid: message.sender.uuid,
        senderName: message.sender.name,
        senderRole: message.sender.role,
        senderAvatar: message.sender.avatar,
        scheduled: message.scheduled,
        sentAt: message.sentAt
      });
    });
    return {
      cursor: cursor,
      messages: messageList
    };
  }

  /**
   * this method return members of a chat channels.
   */
  getChatMembers(channelId): Observable<ChannelMembers[]> {
    if (environment.demo) {
      const response = this.demo.getMembers(channelId);
      return of(this._normaliseChatMembersResponse(response.data)).pipe(delay(1000));
    }
    return this.apollo.chatGraphQLQuery(
      `query getChannelmembers($uuid:String!) {
        channel(uuid:$uuid){
          members{
            uuid
            name
            role
            avatar
            email
          }
        }
      }`,
      {
        uuid: channelId
      }
    ).pipe(map((response: any) => {
      if (response.data) {
        return this._normaliseChatMembersResponse(response.data);
      }
    }));
  }

  private _normaliseChatMembersResponse(data): ChannelMembers[] {
    const result = JSON.parse(JSON.stringify(data.channel.members));
    if (!Array.isArray(result)) {
      this.request.apiResponseFormatError('Member array format error');
      return [];
    }
    if (result.length === 0) {
      return [];
    }
    return result;
  }

  /**
   * This method is returning pusher channel list to subscribe.
   */
  getPusherChannels(): Observable<any[]> {
    if (environment.demo) {
      const response = this.demo.getPusherChannels();
      return of(this._normalisePusherChannelsResponse(response.data)).pipe(delay(1000));
    }
    return this.apollo.chatGraphQLQuery(
      `query getPusherChannels {
        channels {
          pusherChannel
        }
      }`,
      {}
    ).pipe(map((response: any) => {
      if (response.data) {
        return this._normalisePusherChannelsResponse(response.data);
      }
    }));
  }

  private _normalisePusherChannelsResponse(data): any[] {
    const result = JSON.parse(JSON.stringify(data.channels));
    if (!Array.isArray(result)) {
      this.request.apiResponseFormatError('Pusher Channel array format error');
      return [];
    }
    if (result.length === 0) {
      return [];
    }
    return result;
  }

  markMessagesAsSeen(uuids: string[]): Observable<any> {
    if (environment.demo) {
      return of({}).pipe(delay(1000));
    }
    return this.apollo.chatGraphQLMutate(
      `mutation markAsSeen($uuids: [String]!) {
        readChatLogs(uuids: $uuids) {
          success
        }
      }`,
      {
        uuids: uuids
      }
    );
  }

  /**
  //  * @name postNewMessage
   * @description post new text message (with text) or attachment (with file)
   */
  postNewMessage(data: NewMessageParam): Observable<any> {
    if (environment.demo) {
      const response = this.demo.getNewMessage(data);
      return of(this._normalisePostMessageResponse(response.data)).pipe(delay(1000));
    }
    return this.apollo.chatGraphQLMutate(
      `mutation createChatLogs($channelUuid: String!, $message: String, $file: String, $scheduled: String) {
        createChatLog(channelUuid: $channelUuid, message: $message, file: $file, scheduled: $scheduled) {
            uuid
            isSender
            message
            file
            created
            scheduled
            sentAt
            sender {
              uuid
              name
              role
              avatar
          }
        }
      }`,
      {
        channelUuid: data.channelUuid,
        message: data.message,
        file: data.file,
        scheduled: data.scheduled
      }
    ).pipe(
      map(response => {
        if (response.data) {
          return this._normalisePostMessageResponse(response.data);
        }
      })
    );
  }

  private _normalisePostMessageResponse(data): Message {
    const result = JSON.parse(JSON.stringify(data.createChatLog));
    if (!this.utils.has(result, 'uuid') ||
      !this.utils.has(result, 'sender.uuid') ||
      !this.utils.has(result, 'isSender') ||
      !this.utils.has(result, 'message') ||
      !this.utils.has(result, 'created') ||
      !this.utils.has(result, 'file')) {
      this.request.apiResponseFormatError('chat channel format error');
      return null;
    }
    let fileObject = null;
    if ((typeof result.file) === 'string') {
      fileObject = JSON.parse(result.file);
    } else {
      fileObject = result.file;
    }
    return {
      uuid: result.uuid,
      isSender: result.isSender,
      message: result.message,
      file: result.file,
      fileObject: fileObject,
      created: result.created,
      senderUuid: result.sender.uuid,
      senderName: result.sender.name,
      senderRole: result.sender.role,
      senderAvatar: result.sender.avatar,
      scheduled: result.scheduled,
      sentAt: result.sentAt
    };
  }

  postAttachmentMessage(data: NewMessageParam): Observable<any> {
    if (!data.file) {
      throw new Error('Fatal: File value must not be empty.');
    }
    return this.postNewMessage(data);
  }

  /**
 * this method create new cohort channel.
 */
  createChannel(data: NewChannelParam): Observable<ChatChannel> {
    if (environment.demo) {
      const response = this.demo.getNewChannel(data);
      return of(this._normaliseCreateChannelResponse(response.data)).pipe(delay(1000));
    }
    return this.apollo.chatGraphQLMutate(
      `mutation createChannel($name: String, $isAnnouncement: Boolean, $roles: [String], $members: [MemberInput]!){
        createChannel(name: $name, isAnnouncement: $isAnnouncement, roles: $roles, members: $members) {
            uuid
            name
            avatar
            pusherChannel
            isAnnouncement
            isDirectMessage
            readonly
            roles
            canEdit
        }
    }`,
      {
        name: data.name,
        isAnnouncement: data.isAnnouncement,
        roles: data.roles,
        members: data.members
      }
    ).pipe(
      map(response => {
        if (response.data) {
          return this._normaliseCreateChannelResponse(response.data);
        }
      })
    );
  }

  private _normaliseCreateChannelResponse(data): ChatChannel {
    const result = JSON.parse(JSON.stringify(data.createChannel));
    if (!this.utils.has(result, 'uuid') ||
      !this.utils.has(result, 'name') ||
      !this.utils.has(result, 'avatar') ||
      !this.utils.has(result, 'pusherChannel') ||
      !this.utils.has(result, 'isAnnouncement') ||
      !this.utils.has(result, 'isDirectMessage') ||
      !this.utils.has(result, 'readonly') ||
      !this.utils.has(result, 'roles') ||
      !this.utils.has(result, 'canEdit')) {
      this.request.apiResponseFormatError('chat channel format error');
      return null;
    }
    return {
      uuid: result.uuid,
      name: result.name,
      avatar: result.avatar,
      pusherChannel: result.pusherChannel,
      isAnnouncement: result.isAnnouncement,
      isDirectMessage: result.isDirectMessage,
      readonly: result.readonly,
      roles: result.roles,
      unreadMessageCount: 0,
      lastMessage: null,
      lastMessageCreated: null,
      canEdit: result.canEdit,
      scheduledMessageCount: result.scheduledMessageCount
    };
  }

  deleteChatChannel(channelUuid) {
    if (environment.demo) {
      return of({}).pipe(delay(1000));
    }
    return this.apollo.chatGraphQLMutate(
      `mutation deleteChannel($uuid: String!){
        deleteChannel(uuid: $uuid) {
            success
        }
      }`,
      {
        uuids: channelUuid
      }
    );
  }

  editChatChannel(data: EditChannelParams): Observable<ChatChannel> {
    if (environment.demo) {
      const response = this.demo.getEditedChannel(data);
      return of(this._normaliseEditChannelResponse(response.data)).pipe(delay(1000));
    }
    return this.apollo.chatGraphQLMutate(
      `mutation editChannel($uuid: String!, $name: String, $isAnnouncement: Boolean, $roles: [String]){
        editChannel(uuid: $uuid, name: $name, isAnnouncement: $isAnnouncement, roles: $roles) {
            uuid
            name
            avatar
            pusherChannel
            isAnnouncement
            isDirectMessage
            readonly
            roles
            unreadMessageCount
            lastMessage
            lastMessageCreated
            canEdit
        }
      }`,
      {
        uuid: data.uuid,
        name: data.name,
        isAnnouncement: data.isAnnouncement,
        roles: data.roles
      }
    ).pipe(
      map(response => {
        if (response.data) {
          return this._normaliseEditChannelResponse(response.data);
        }
      })
    );
  }

  private _normaliseEditChannelResponse(data): ChatChannel {
    const result = JSON.parse(JSON.stringify(data.editChannel));
    if (!this.utils.has(result, 'uuid') ||
      !this.utils.has(result, 'name') ||
      !this.utils.has(result, 'avatar') ||
      !this.utils.has(result, 'pusherChannel') ||
      !this.utils.has(result, 'isAnnouncement') ||
      !this.utils.has(result, 'isDirectMessage') ||
      !this.utils.has(result, 'readonly') ||
      !this.utils.has(result, 'roles') ||
      !this.utils.has(result, 'unreadMessageCount') ||
      !this.utils.has(result, 'lastMessage') ||
      !this.utils.has(result, 'lastMessageCreated') ||
      !this.utils.has(result, 'canEdit')) {
      this.request.apiResponseFormatError('chat channel format error');
      return null;
    }
    return {
      uuid: result.uuid,
      name: result.name,
      avatar: result.avatar,
      pusherChannel: result.pusherChannel,
      isAnnouncement: result.isAnnouncement,
      isDirectMessage: result.isDirectMessage,
      readonly: result.readonly,
      roles: result.roles,
      unreadMessageCount: result.unreadMessageCount,
      lastMessage: result.lastMessage,
      lastMessageCreated: result.lastMessageCreated,
      canEdit: result.canEdit,
      scheduledMessageCount: result.scheduledMessageCount
    };
  }

  searchTimelineUsers(data: SearchUsersParam): Observable<User[]> {
    if (environment.demo) {
      const response = this.demo.getUsers(data);
      return of(this._normaliseSearchTimelineUsersResponse(response.data)).pipe(delay(1000));
    }
    return this.apollo.graphQLFetch(
      `query getUsers($scope: String, $scopeUuid: String, $filter: String, $teamUserOnly: Boolean) {
        users(scope: $scope, scopeUuid: $scopeUuid, filter: $filter, teamUserOnly: $teamUserOnly) {
          uuid
          name
          email
          role
          avatar
          enrolmentUuid
          team {
            uuid
            name
          }
        }
      }`,
      {
        scope: data.scope,
        scopeUuid: data.scopeUuid,
        filter: data.filter,
        teamUserOnly: data.teamUserOnly
      }
    ).pipe(
      map(response => {
        if (response.data) {
          return this._normaliseSearchTimelineUsersResponse(response.data);
        }
      })
    );
  }

  private _normaliseSearchTimelineUsersResponse(data): User[] {
    const result = JSON.parse(JSON.stringify(data.users));
    if (!Array.isArray(result)) {
      this.request.apiResponseFormatError('User array format error');
      return [];
    }
    if (result.length === 0) {
      return [];
    }
    const myEmail = this.storage.getUser().email;
    const userList = [];
    result.forEach(user => {
      if (user.email !== myEmail) {
        userList.push(user);
      }
    });
    return userList;
  }

  deleteChatMesage(uuid: string): Observable<any> {
    if (environment.demo) {
      return of({}).pipe(delay(1000));
    }
    return this.apollo.chatGraphQLMutate(
      `mutation deletechatMessage($uuid: String!) {
        deleteChatLog(uuid: $uuid) {
          success
        }
      }`,
      {
        uuid: uuid
      }
    );
  }

  editChatMesage(data: EditMessageParam): Observable<any> {
    if (environment.demo) {
      return of({}).pipe(delay(1000));
    }
    return this.apollo.chatGraphQLMutate(
      `mutation edichatMessage($uuid: String!, $message: String, $file: String, $scheduled: String) {
        editChatLog(uuid: $uuid, message: $message, file: $file, scheduled: $scheduled) {
          success
        }
      }`,
      {
        uuid: data.uuid,
        message: data.message,
        file: data.file,
        scheduled: data.scheduled
      }
    );
  }

}
