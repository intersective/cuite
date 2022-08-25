import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';

import { StorageService } from '@services/storage.service';
import { UtilsService } from '@services/utils.service';
import { PusherService } from '@shared/pusher/pusher.service';
import { FilestackService } from '@shared/filestack/filestack.service';
import { PopupService } from '@shared/popup/popup.service';

import { ChatService, ChatChannel, Message, MessageListResult } from '../chat.service';
import { EditScheduleMessagePopupComponent } from '../edit-schedule-message-popup/edit-schedule-message-popup.component';

@Component({
  selector: 'app-schedule-message-list',
  templateUrl: './schedule-message-list.component.html',
  styleUrls: ['./schedule-message-list.component.scss'],
})
export class ScheduleMessageListComponent implements OnInit {

  @ViewChild('content') private content: ElementRef;
  @Input() channelUuid: string;
  @Input() channelName: string;

  // message history list
  messageList: Message[] = [];
  messagePageCursor = '';
  messagePageSize = 20;
  loadingScheduleMessages = false;

  constructor(
    private chatService: ChatService,
    public storage: StorageService,
    public utils: UtilsService,
    public pusherService: PusherService,
    private filestackService: FilestackService,
    private modalController: ModalController,
    private popupService: PopupService,
  ) { }

  ngOnInit() {
    this._initialise();
    this.loadMessages();
  }

  private _initialise() {
    this.messageList = [];
    this.loadingScheduleMessages = false;
    this.messagePageCursor = '';
    this.messagePageSize = 20;
  }

  loadMessages(event?) {
    // if one chat request send to the api. not calling other one.
    // because in some cases second api call respose return before first one.
    // then messages getting mixed.
    if (this.loadingScheduleMessages) {
      return;
    }
    this.loadingScheduleMessages = true;
    this.chatService
      .getMessageList({
        channelUuid: this.channelUuid,
        cursor: this.messagePageCursor,
        size: this.messagePageSize,
        scheduledOnly: true
      })
      .subscribe(
        (messageListResult: MessageListResult) => {
          if (!messageListResult) {
            this.loadingScheduleMessages = false;
            return;
          }
          const messages = messageListResult.messages;
          if (messages.length === 0) {
            this.loadingScheduleMessages = false;
            return;
          }
          this.messagePageCursor = messageListResult.cursor;
          this.loadingScheduleMessages = false;
          if (event) {
            event.target.complete();
          }
          if (this.messageList.length > 0) {
            this.messageList = messages.concat(this.messageList);
          } else {
            this.messageList = messages;
          }
        },
        error => {
          this.loadingScheduleMessages = false;
        }
      );
  }

  getScheduleDate(date) {
    const utcToLocalTime = this.utils.utcLocalforScheduleMessages(date, 'time');
    const utcToLocalDate = this.utils.utcLocalforScheduleMessages(date, 'date');
    return `${utcToLocalTime} / ${utcToLocalDate}`;
  }

  previewFile(file) {
    return this.filestackService.previewFile(file);
  }

  deleteMessage(messageUuid) {
    this.popupService.showAlert({
      header: 'Delete Scheduled Message?',
      message: 'Are you sure you want to delete this scheduled message.<br/>This action cannot be undone.',
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
              // this will update chat room schedule message count
              this.utils.broadcastEvent('chat:schedule-delete', {
                channel: this.channelUuid,
                deleted: true
              });
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
  }

  async openEditMessagePopup(index, reSchedule) {
    const modal = await this.modalController.create({
      component: EditScheduleMessagePopupComponent,
      cssClass: 'chat-schedule-message-popup',
      componentProps: {
        chatMessage: this.messageList[index],
        channelName: this.channelName,
        reScheduled: reSchedule
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
      if (data.data.updateSuccess && data.data.reScheduledData) {
        this.messageList[index].scheduled = data.data.reScheduledData;
      }
      if (data.data.updateSuccess && data.data.newMessageData) {
        this.messageList[index].message = data.data.newMessageData;
      }
      // this will update chat list
      this.utils.broadcastEvent('chat:info-update', true);
    });
  }

}
