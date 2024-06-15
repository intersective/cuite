import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

import { StorageService } from '@services/storage.service';
import { UtilsService } from '@services/utils.service';
import { PusherService } from '@shared/pusher/pusher.service';
import { FilestackService } from '@shared/filestack/filestack.service';

import { ChatService, ChatChannel, Message, MessageListResult } from '../chat.service';

@Component({
  selector: 'app-edit-schedule-message-popup',
  templateUrl: './edit-schedule-message-popup.component.html',
  styleUrls: ['./edit-schedule-message-popup.component.scss'],
})
export class EditScheduleMessagePopupComponent implements OnInit {

  @Input() reScheduled = false;
  @Input() chatMessage: Message;
  @Input() channelName: string;
  @Input() isSentMessageEdit = false;
  messageUuid: string;
  selectedDate: string;
  selectedTime: string;
  message: string;
  sending: boolean;
  invalidDateTime: boolean;
  updateSuccess: boolean;
  scheduledDateTime: string;

  constructor(
    private chatService: ChatService,
    public storage: StorageService,
    public utils: UtilsService,
    public pusherService: PusherService,
    private filestackService: FilestackService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this._initialise();
  }

  private _initialise() {
    this.sending = false;
    this.selectedDate = '';
    this.selectedTime = '';
    this.invalidDateTime = false;
    this.updateSuccess = false;
    this.message = this.chatMessage ? this.chatMessage.message : null;
    this.messageUuid = this.chatMessage ? this.chatMessage.uuid : null;
    this.scheduledDateTime = this.chatMessage ? this.chatMessage.scheduled : null;
    if (this.reScheduled) {
      const originalDateTime = this.utils.iso8601Formatter(this.scheduledDateTime);
      this.selectedDate = moment(new Date(originalDateTime)).format('YYYY-MM-DD');
      this.selectedTime = moment(new Date(originalDateTime)).format('HH:mm:ss');
    }
  }

  /**
   * This will cloase the group chat popup
   */
  close() {
    let returnData: {} = {
      updateSuccess: false,
      reScheduledData: null,
      newMessageData: null
    };
    if (this.updateSuccess) {
      if (this.reScheduled) {
        returnData = {
          updateSuccess: this.updateSuccess,
          reScheduledData: this.scheduledDateTime
        };
      } else {
        returnData = {
          updateSuccess: this.updateSuccess,
          newMessageData: this.message
        };
      }
    }
    this.modalController.dismiss(returnData);
  }

  EditMessage() {
    if (!this.messageUuid) {
      return;
    }

    if (this.reScheduled && (!this.selectedDate || !this.selectedTime) ) {
      return;
    }

    if (this.reScheduled && !this.isValidDateTime(`${this.selectedDate} ${this.selectedTime}`)) {
      return;
    }

    this.sending = true;
    const dateObj = new Date(`${this.selectedDate} ${this.selectedTime}`);

    const editMessageParam: {
      uuid: string;
      message?: string;
      scheduled?: string;
    } = {
      uuid: this.messageUuid,
      message: this.message
    };
    if (this.reScheduled) {
      delete editMessageParam.message;
      editMessageParam.scheduled = dateObj.toISOString();
      this.scheduledDateTime = dateObj.toISOString();
    }

    this.chatService.editChatMesage(editMessageParam).subscribe(
      response => {
        this.updateSuccess = true;
        this.sending = false;
      },
      error => {
        console.log(error);
        this.sending = false;
      }
    );
  }

  /**
 * this method will check is selected date and time valid.
 * - we are not allow to select previous date and time.
 * - selected time at least should be 30 minutes in future to be valid.
 * @param selectedDateTime date time user select to schedule the message
 * @returns boolean
 */
  isValidDateTime(selectedDateTime) {
    if (!selectedDateTime) {
      return;
    }
    const dateTimeDiff = this.utils.getDateDifferenceInMinutes(selectedDateTime);
    if (dateTimeDiff >= 0) {
      this.invalidDateTime = false;
      return true;
    } else {
      this.invalidDateTime = true;
      return false;
    }
  }

}
