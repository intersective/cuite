import { Component, Input, ViewChild, NgZone, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, ModalController, PopoverController } from '@ionic/angular';

import { StorageService } from '@services/storage.service';
import { UtilsService } from '@services/utils.service';
import { PusherService, SendMessageParam } from '@shared/pusher/pusher.service';
import { FilestackService } from '@shared/filestack/filestack.service';
import { PopupService } from '@shared/popup/popup.service';

import { ChatService, ChatChannel, Message, MessageListResult } from '../chat.service';
import { ChatPreviewComponent } from '../chat-preview/chat-preview.component';
import { ChatInfoComponent } from '../chat-info/chat-info.component';
import { ScheduleMessagePopupComponent } from '../schedule-message-popup/schedule-message-popup.component';
import { EditScheduleMessagePopupComponent } from '../edit-schedule-message-popup/edit-schedule-message-popup.component';
import { AttachmentPopoverComponent } from '../attachment-popover/attachment-popover.component';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatRoomComponent {
  @ViewChild(IonContent) content: IonContent;
  @Input() skeletonOnly: boolean;
  @Input() chatChannel?: ChatChannel = {
    uuid: '',
    name: '',
    avatar: '',
    pusherChannel: '',
    isAnnouncement: false,
    isDirectMessage: false,
    readonly: false,
    roles: [],
    unreadMessageCount: 0,
    lastMessage: '',
    lastMessageCreated: '',
    canEdit: false,
    scheduledMessageCount: 0
  };

  channelUuid: string;
  // message history list
  messageList: Message[] = [];
  // the message that the current user is typing
  message: string;
  messagePageCursor = '';
  messagePageSize = 20;
  loadingChatMessages = false;
  sendingMessage = false;
  // display "someone is typing" when received a typing event
  whoIsTyping: string;
  isScheduleListOpen: boolean;

  selectedAttachments: any[] = [];

  constructor(
    private chatService: ChatService,
    public router: Router,
    public storage: StorageService,
    private route: ActivatedRoute,
    public utils: UtilsService,
    public pusherService: PusherService,
    private filestackService: FilestackService,
    private modalController: ModalController,
    private ngZone: NgZone,
    public element: ElementRef,
    private popupService: PopupService,
    public popoverController: PopoverController
  ) {
    if (this.skeletonOnly) {
      return;
    }
    // message by team
    this.utils.getEvent('chat:new-message').subscribe(event => {
      console.log('====1===');
      const receivedMessage = this.getMessageFromEvent(event);
      if (this.utils.isEmpty(receivedMessage) || receivedMessage.channelUuid !== this.channelUuid) {
        console.log('====2===');
        return;
      }
      // if received message is schedule one need to update count
      if (event.isScheduled) {
        console.log('====3===');
        this.chatChannel.scheduledMessageCount -= 1;
      }
      if (!this.utils.isEmpty(receivedMessage)) {
        console.log('====4===',  receivedMessage);
        this.messageList.push(receivedMessage);
        this._markAsSeen();
        this._scrollToBottom();
        this.utils.broadcastEvent('chat:info-update', true);
      }
    });

    // Update schedule message count when messages get delete
    this.utils.getEvent('chat:schedule-delete').subscribe(event => {
      const receivedChannel = event.channel;
      if (receivedChannel !== this.channelUuid) {
        return;
      }
      if (event.deleted) {
        this.chatChannel.scheduledMessageCount -= 1;
      }
    });

    this.utils.getEvent('chat:delete-message').subscribe(event => {
      if (this.utils.isEmpty(event) || event.channelUuid !== this.channelUuid) {
        return;
      }
      const deletedMessageIndex = this.messageList.findIndex(message => {
        return message.uuid === event.uuid;
      });
      if (deletedMessageIndex > -1) {
        this.messageList.splice(deletedMessageIndex, 1);
      }
    });

    this.utils.getEvent('chat:edit-message').subscribe(event => {
      const receivedMessage = this.getMessageFromEvent(event);
      if (this.utils.isEmpty(receivedMessage) || receivedMessage.channelUuid !== this.channelUuid) {
        return;
      }

      const editedMessageIndex = this.messageList.findIndex(message => {
        return message.uuid === event.uuid;
      });
      if (editedMessageIndex > -1 && !this.utils.isEmpty(receivedMessage)) {
        this.messageList[editedMessageIndex] = receivedMessage;
      }
    });
  }

  onEnter() {
    if (this.skeletonOnly) {
      this.loadingChatMessages = true;
      return;
    }
    this._initialise();
    this._subscribeToPusherChannel();
    this._loadMessages();
    this._scrollToBottom();
  }

  private _initialise() {
    this.message = '';
    this.messageList = [];
    this.loadingChatMessages = false;
    this.messagePageCursor = '';
    this.messagePageSize = 20;
    this.sendingMessage = false;
    this.whoIsTyping = '';
    this.isScheduleListOpen = false;
  }

  private _subscribeToPusherChannel() {
    this.channelUuid = this.chatChannel.uuid;
    // subscribe to typing event
    this.utils.getEvent('typing-' + this.chatChannel.pusherChannel).subscribe(event => this._showTyping(event));
  }

  /**
   * @description listen to pusher event for new message
   */
  getMessageFromEvent(data): Message {
    console.log('====1===1', data);
    if (data) {
      return null;
    }
    const receivedMessage: Message = {
      uuid: data.uuid,
      senderName: data.senderName,
      senderRole: data.senderRole,
      senderAvatar: data.senderAvatar,
      senderUuid: data.senderUuid,
      isSender: false,
      message: data.message,
      created: data.created,
      file: data.file,
      channelUuid: data.channelUuid,
      sentAt: data.sentAt
    };
    if (receivedMessage && receivedMessage.file) {
      let fileObject = null;
      fileObject = typeof receivedMessage.file === 'string' ? JSON.parse(receivedMessage.file) : receivedMessage.file;
      if (this.utils.isEmpty(fileObject)) {
        fileObject = null;
      }
      receivedMessage.fileObject = fileObject;
      receivedMessage.preview = this.attachmentPreview(receivedMessage.fileObject);
    }
    if (receivedMessage.senderUuid &&
      this.storage.getUser().uuid &&
      receivedMessage.senderUuid === this.storage.getUser().uuid
    ) {
      receivedMessage.isSender = true;
    }
    console.log('====1===2', receivedMessage);
    return receivedMessage;
  }

  private _loadMessages() {
    // if one chat request send to the api. not calling other one.
    // because in some cases second api call respose return before first one.
    // then messages getting mixed.
    if (this.loadingChatMessages) {
      return;
    }
    this.loadingChatMessages = true;
    this.chatService
      .getMessageList({
        channelUuid: this.channelUuid,
        cursor: this.messagePageCursor,
        size: this.messagePageSize
      })
      .subscribe(
        (messageListResult: MessageListResult) => {
          if (!messageListResult) {
            this.loadingChatMessages = false;
            return;
          }
          let messages = messageListResult.messages;
          if (messages.length === 0) {
            this.loadingChatMessages = false;
            return;
          }
          this.messagePageCursor = messageListResult.cursor;
          this.loadingChatMessages = false;
          messages = messages.map(msg => {
            if (msg.file && msg.fileObject) {
              msg.preview = this.attachmentPreview(msg.fileObject);
            }
            return msg;
          });
          messages.reverse();
          if (this.messageList.length > 0) {
            this.messageList = messages.concat(this.messageList);
          } else {
            this.messageList = messages;
            this._scrollToBottom();
          }
          this._markAsSeen();
        },
        error => {
          this.loadingChatMessages = false;
        }
      );
  }

  loadMoreMessages(event) {
    const scrollTopPosition = event.detail.scrollTop;
    if (scrollTopPosition === 0) {
      this._loadMessages();
    }
  }

  back() {
    return this.ngZone.run(() => this.router.navigate(['app', 'chat']));
  }

  sendMessage() {
    if (this.sendingMessage) {
      return;
    }
    if (this.selectedAttachments.length > 0) {
      this._postAttachment();
    } else {
      this.postTextOnlyMessage();
    }
  }

  private getPostMessageParams(type, file?: any) {
    if (type === 'text') {
      if (!this.message || this.utils.isQuillContentEmpty(this.message)) {
        return;
      }
      const message = this.message;
      return {
        channelUuid: this.channelUuid,
        message: message
      };
    }
    if (type === 'file' && file) {
      if (!file.mimetype) {
        file.mimetype = '';
      }
      const message = this.message;
      return {
        channelUuid: this.channelUuid,
        message: message,
        file: JSON.stringify(file)
      };
    } else {
      return;
    }
  }

  postTextOnlyMessage() {
    const param = this.getPostMessageParams('text');
    this._beforeSenMessages();
    this.chatService.postNewMessage(param).subscribe(
      response => {
        this.triggerPusherEvent(response);
        this.updateListData(response);
        this.utils.broadcastEvent('chat:info-update', true);
        this._scrollToBottom();
        this._afterSendMessage();
      },
      error => {
        this._afterSendMessage();
      }
    );
  }

  private _postAttachment() {
    const selectedAttachments = this.selectedAttachments;
    this.selectedAttachments = [];
    selectedAttachments.forEach(attachment => {
      const param = this.getPostMessageParams('file', attachment);
      this._beforeSenMessages();
      this.chatService.postAttachmentMessage(param).subscribe(
        response => {
          this.triggerPusherEvent(response, attachment);
          this.updateListData(response);
          this.utils.broadcastEvent('chat:info-update', true);
          this._scrollToBottom();
          this.removeSelectAttachment(attachment);
          this._afterSendMessage();
        },
        error => {
          this._afterSendMessage();
        }
      );
    });
  }

  triggerPusherEvent(response, file?: any) {
    const pusherData: SendMessageParam = {
      channelUuid: this.channelUuid,
      uuid: response.uuid,
      isSender: response.isSender,
      message: response.message,
      file: response.file,
      created: response.created,
      senderUuid: response.senderUuid,
      senderName: response.senderName,
      senderRole: response.senderRole,
      senderAvatar: response.senderAvatar,
      sentAt: response.sentAt
    };
    if (file) {
      pusherData.file = JSON.stringify(file);
    }
    this.pusherService.triggerSendMessage(this.chatChannel.pusherChannel, pusherData);
  }

  updateListData(response) {
    this.messageList.push(
      {
        uuid: response.uuid,
        isSender: response.isSender,
        message: response.message,
        file: response.file,
        fileObject: response.fileObject,
        preview: this.attachmentPreview(response.fileObject),
        created: response.created,
        senderUuid: response.senderUuid,
        senderName: response.senderName,
        senderRole: response.senderRole,
        senderAvatar: response.senderAvatar,
        sentAt: response.sentAt
      }
    );
  }

   /**
   * need to clear type message before send api call.
   * because if we wait untill api response to clear the type message user may think message not sent and
   *  will press send button multiple times.
   * to indicate message sending we have loading controll by sendingMessage.
   * we will insert type message to cost variable befoer clear it so type message will not lost from the api call.
   */
  private _beforeSenMessages() {
    this.sendingMessage = true;
    // remove typed message from text area and shrink text area.
    this.message = '';
  }

  private _afterSendMessage() {
    this.sendingMessage = false;
    /**
     * if there are no previous messages message page cursor is empty.
     * after user start sending message, if page cursor is empty we need to set cursor.
     * if we didn't do that when user scroll message list api call with page cursor empty and load same messages again.
     * only way we can get cursor is from API. so calling message list in background to get cursor.
     */
    if (this.messageList.length > 0 && this.utils.isEmpty(this.messagePageCursor)) {
      this.chatService
      .getMessageList({
        channelUuid: this.channelUuid,
        cursor: this.messagePageCursor,
        size: this.messagePageSize
      })
      .subscribe((messageListResult: MessageListResult) => {
        const messages = messageListResult.messages;
        if (messages.length === 0) {
          this.messagePageCursor = '';
          return;
        }
        this.messagePageCursor = messageListResult.cursor;
      });
    }
  }

  // call chat api to mark message as seen messages
  private _markAsSeen() {
    console.log('====4===1');
    const messageIds = this.messageList.map(m => m.uuid);
    this.chatService
      .markMessagesAsSeen(messageIds)
      .subscribe (
        res => {
          this.utils.broadcastEvent('chat-badge-update', {
            channelUuid: this.chatChannel.uuid,
            readcount: messageIds.length
          });
        },
        err => {}
      );
  }

  getMessageDate(date) {
    return this.utils.timeFormatter(date);
  }

  /**
   * this method will return correct css class for chat avatar to adjust view
   * @param message message object
   * - if selected chat is a team chat and we are not showing time with this message.
   *  - return 'no-time-team' css class. it will add 'margin-top: -8%' to avatar.
   * - if selected chat is not a team and we are not showing time with this message.
   *  - return 'no-time' css class. it will add 'margin-top: 8%' to avatar.
   * - if user not in mobile platform and selected chat is a team and we are showing time with this message.
   *  - return 'with-time-team' css class. it will add 'margin-top: 0' to avatar.
   * - if these conditions not complete
   *  - return empty srting.
   */
  getAvatarClass(message) {
    if (!this.checkToShowMessageTime(message)) {
      return 'no-time';
    }
    return '';
  }

  /**
   * check same user have messages inline
  //  * @param {int} message
   */
  isLastMessage(message) {
    const index = this.messageList.findIndex(function(msg, i) {
      return msg.uuid === message.uuid;
    });
    if (index === -1) {
      this.messageList[index].noAvatar = true;
      return false;
    }
    const currentMessage = this.messageList[index];
    const nextMessage = this.messageList[index + 1];
    if (currentMessage.isSender) {
      this.messageList[index].noAvatar = true;
      return false;
    }
    if (!nextMessage) {
      this.messageList[index].noAvatar = false;
      return true;
    }
    const currentMessageTime = new Date(this.messageList[index].sentAt);
    const nextMessageTime = new Date(this.messageList[index + 1].sentAt);
    if (currentMessage.senderName !== nextMessage.senderName) {
      this.messageList[index].noAvatar = false;
      return true;
    }
    const timeDiff =
      (nextMessageTime.getTime() - currentMessageTime.getTime()) /
      (60 * 1000);
    if (timeDiff > 5) {
      this.messageList[index].noAvatar = false;
      return true;
    } else {
      this.messageList[index].noAvatar = true;
      return false;
    }
  }

  /**
   * check message sender and return related css class
  //  * @param {object} message
   */
  getClassForMessageBubble(message) {
    if (message.isSender) {
      return 'send-messages';
    }
    if (message.noAvatar) {
      return 'received-messages no-avatar';
    }
    return 'received-messages';
  }

  getClassForMessageBody(message) {
    if (!message.fileObject || !message.fileObject.mimetype ||
      (!message.fileObject.mimetype.includes('image') && !message.fileObject.mimetype.includes('video'))) {
      return '';
    }
    if (message.fileObject.mimetype && message.fileObject.mimetype.includes('video')) {
      return 'video-attachment-container';
    }
    if (message.fileObject.mimetype && message.fileObject.mimetype.includes('image')) {
      return 'image';
    }
  }

  /**
   * check date and time diffrance between current message(message object of index) old message.
  //  * @param {int} message
   */
  checkToShowMessageTime(message) {
    const index = this.messageList.findIndex(function(msg, i) {
      return msg.uuid === message.uuid;
    });
    if (index <= -1) {
      return;
    }
    // show message time for the first message
    if (!this.messageList[index - 1]) {
      return true;
    }
    const currentMessageTime = new Date(this.messageList[index].sentAt);
    const oldMessageTime = new Date(this.messageList[index - 1].sentAt);
    if ((currentMessageTime.getDate() - oldMessageTime.getDate()) === 0) {
      return this._checkmessageOldThan5Min(
        currentMessageTime,
        oldMessageTime
      );
    }
    return true;
  }

  /**
   * check time diffrance larger than 5 min.
  //  * @param {object} currentMessageTime
  //  * @param {object} oldMessageTime
   */
  private _checkmessageOldThan5Min(currentMessageTime, oldMessageTime) {
    const timeDiff =
      (currentMessageTime.getTime() - oldMessageTime.getTime()) / (60 * 1000);
    if (timeDiff > 5) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Trigger typing event when user is typing
   */
  typing() {
    if (!this.utils.isEmpty(this.message)) {
      this._scrollToBottom();
    }
    // check quill content is empty. if it is then empty string to message.
    // this will let user to clear message if they added formating that we not supporting.
    if (!this.utils.isEmpty(this.message) && this.utils.isQuillContentEmpty(this.message)) {
      this.message = '';
    }
    this.pusherService.triggerTyping(this.chatChannel.pusherChannel);
  }

  private _showTyping(event) {
    // don't need to show typing message if the current user is the one who is typing
    if (event.user === this.storage.getUser().name) {
      return;
    }
    this.whoIsTyping = event.user + ' is typing';
    this._scrollToBottom();
    setTimeout(
      () => {
        this.whoIsTyping = '';
      },
      3000
    );
  }

  private _scrollToBottom() {
    console.log('====4===2');
    setTimeout(
      () => {
        this.content.scrollToBottom();
        console.log('====4===3');
      },
      500
    );
  }

  private attachmentPreview(filestackRes) {
    if (!filestackRes) {
      return;
    }
    let preview = `Uploaded ${filestackRes.filename}`;
    const dimension = 224;
    if (!filestackRes.mimetype) {
      return preview;
    }
    if (filestackRes.mimetype.includes('image')) {
      const attachmentURL = `https://cdn.filestackcontent.com/quality=value:70/resize=w:${dimension},h:${dimension},fit:crop/${filestackRes.handle}`;
      // preview = `<p>Uploaded ${filestackRes.filename}</p><img src=${attachmentURL}>`;
      preview = `<img src=${attachmentURL}>`;
    } else if (filestackRes.mimetype.includes('video')) {
      // we'll need to identify filetype for 'any' type fileupload
      preview = `<app-file-display [file]="submission.answer" [fileType]="question.fileType"></app-file-display>`;
    }

    return preview;
  }

  previewFile(file) {
    return this.filestackService.previewFile(file);
  }

  getTypeByMime(mimetype: string): string {
    const zip = [
      'application/x-compressed',
      'application/x-zip-compressed',
      'application/zip',
      'multipart/x-zip',
    ];

    let result = '';

    if (!mimetype) {
      return 'File';
    }

    if (zip.indexOf(mimetype) >= 0) {
      result = 'Zip';

    // set icon to different document type (excel, word, powerpoint, audio, video)
    } else if (mimetype.indexOf('audio/') >= 0) {
      result = 'Audio';
    } else if (mimetype.indexOf('image/') >= 0) {
      result = 'Image';
    } else if (mimetype.indexOf('text/') >= 0) {
      result = 'Text';
    } else if (mimetype.indexOf('video/') >= 0) {
      result = 'Video';
    } else {
      switch (mimetype) {
        case 'application/pdf':
          result = 'PDF';
          break;
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          result = 'Word';
          break;
        case 'application/excel':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/x-excel':
        case 'application/x-msexcel':
          result = 'Excel';
          break;
        case 'application/mspowerpoint':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/x-mspowerpoint':
          result = 'Powerpoint';
          break;
        default:
          result = 'File';
          break;
      }
    }

    return result;
  }

  getIconByMime(mimetype: string): string {
    const zip = [
      'application/x-compressed',
      'application/x-zip-compressed',
      'application/zip',
      'multipart/x-zip',
    ];
    let result = '';

    if (zip.indexOf(mimetype) >= 0) {
      result = 'document';
    } else if (mimetype.includes('audio')) {
      result = 'volume-mute';
    } else if (mimetype.includes('image')) {
      result = 'photos';
    } else if (mimetype.includes('text')) {
      result = 'clipboard-outline';
    } else if (mimetype.includes('video')) {
      result = 'videocam';
    } else {
      switch (mimetype) {
        case 'application/pdf':
          result = 'document'; // 'pdf';
          break;
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          result = 'document'; // 'word';
          break;
        case 'application/excel':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/x-excel':
        case 'application/x-msexcel':
          result = 'document'; // 'excel';
          break;
        case 'application/mspowerpoint':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/x-mspowerpoint':
          result = 'document'; // 'powerpoint';
          break;
        default:
          result = 'document'; // 'file';
          break;
      }
    }

    return result;
  }

  async preview(file) {
    const modal = await this.modalController.create({
      component: ChatPreviewComponent,
      componentProps: {
        file,
      }
    });
    return await modal.present();
  }

  createThumb(video, w, h) {
    const c = document.createElement('canvas'),    // create a canvas
        ctx = c.getContext('2d');                // get context
    c.width = w;                                 // set size = thumb
    c.height = h;
    ctx.drawImage(video, 0, 0, w, h);            // draw in frame
    return c;                                    // return canvas
  }

  async openChatInfo() {
    const modal = await this.modalController.create({
      component: ChatInfoComponent,
      cssClass: 'chat-info-page',
      componentProps: {
        selectedChat: this.chatChannel,
      }
    });
    await modal.present();
    modal.onWillDismiss().then((data) => {
      if (data.data && (data.data.type === 'channelDeleted' || data.data.channelName !== this.chatChannel.name)) {
        this.utils.broadcastEvent('chat:info-update', true);
      }
    });
  }

  async openSchedulePopup() {
    const message = this.message;
    const selectedAttachments = this.selectedAttachments;
    this.sendingMessage = true;
    const modal = await this.modalController.create({
      component: ScheduleMessagePopupComponent,
      cssClass: 'chat-schedule-message-popup',
      componentProps: {
        channelUuid: this.channelUuid,
        scheduledMessage: message,
        scheduledAttachments: selectedAttachments,
        channelName: this.chatChannel.name
      }
    });
    await modal.present();
    modal.onWillDismiss().then((data) => {
      this.sendingMessage = false;
      if (data.data.messageScheduled) {
        this.selectedAttachments = [];
        this.message = '';
        this.chatChannel.scheduledMessageCount += 1;
        this.utils.broadcastEvent('chat:info-update', true);
      }
    });
  }

  deleteMessage(messageUuid) {
    this.popupService.showAlert({
      header: 'Delete Message?',
      message: 'Are you sure you want to delete this message. This action cannot be undone.',
      cssClass: 'message-delete-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete Message',
          cssClass: 'danger',
          handler: () => {
            this.chatService.deleteChatMesage(messageUuid).subscribe(res => {
              // this will update chat list
              this.utils.broadcastEvent('chat:info-update', true);
              /*
              if we call loadMessages() again here it will call with newest cursor.
              then if that new cursor is for next page, it will load new messages but old message/deleted message still in the list.
              */
              this.removeMessageFromList(messageUuid);
            });
          }
        },
      ]
    });
  }

  removeMessageFromList(messageUuid) {
    const deletedMessageIndex = this.messageList.findIndex(message => {
      return message.uuid === messageUuid;
    });
    if (deletedMessageIndex === -1) {
      return;
    }
    this.messageList.splice(deletedMessageIndex, 1);
    // trigger pusher client event for delete messages.
    this.pusherService.triggerDeleteMessage(this.chatChannel.pusherChannel, false, {
      channelUuid: this.channelUuid,
      uuid: messageUuid,
    });
  }

  async openEditMessagePopup(index) {
    const modal = await this.modalController.create({
      component: EditScheduleMessagePopupComponent,
      cssClass: 'chat-schedule-message-popup',
      componentProps: {
        chatMessage: this.messageList[index],
        channelName: this.chatChannel.name,
        reScheduled: false,
        isSentMessageEdit: true
      }
    });
    await modal.present();
    modal.onWillDismiss().then((data) => {
    /*
      we can't call loadMessages() again here.
      becouse it will call with cursor to get next set of messages.
      and we can't make cursor null and call loadMessages().
      becaouse the everytime user edit some messages messages get loan again.
    */
      if (data.data.updateSuccess && data.data.newMessageData) {
        this.messageList[index].message = data.data.newMessageData;

        // trigger pusher client event for edit messages.
        this.pusherService.triggerEditMessage(this.chatChannel.pusherChannel, false, {
          channelUuid: this.channelUuid,
          uuid: this.messageList[index].uuid,
          isSender: this.messageList[index].isSender,
          message: this.messageList[index].message,
          file: JSON.stringify(this.messageList[index].file),
          created: this.messageList[index].created,
          senderUuid: this.messageList[index].senderUuid,
          senderName: this.messageList[index].senderName,
          senderRole: this.messageList[index].senderRole,
          senderAvatar: this.messageList[index].senderAvatar,
          sentAt: this.messageList[index].sentAt
        });
      }
      // this will update chat list
      this.utils.broadcastEvent('chat:info-update', true);
    });
  }

  async attachmentSelectPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: AttachmentPopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    this.selectedAttachments.push(data.selectedFile);
  }

  getResizedImageUrl(fileStackObject, dimension) {
    return `https://cdn.filestackcontent.com/quality=value:70/resize=w:${dimension},h:${dimension},fit:crop/${fileStackObject.handle}`;
  }

  removeSelectAttachment(attachment, index?: number, isDelete = false) {
    if (!attachment) {
      return;
    }
    let attachIndex = this.selectedAttachments.indexOf(attachment);
    if (index) {
      attachIndex = index;
    }
    this.selectedAttachments.splice(attachIndex, 1);
    if (isDelete) {
      this.filestackService.deleteFile(attachment.handle).subscribe(console.log);
    }
  }

}
