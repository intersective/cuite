import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { StorageService } from '@services/storage.service';
import { UtilsService } from '@services/utils.service';
import { PusherService } from '@shared/pusher/pusher.service';
import { FilestackService } from '@shared/filestack/filestack.service';

import { ChatService, ChatChannel, Message, MessageListResult } from '../chat.service';

@Component({
  selector: 'app-schedule-message-popup',
  templateUrl: './schedule-message-popup.component.html',
  styleUrls: ['./schedule-message-popup.component.scss'],
})
export class ScheduleMessagePopupComponent implements OnInit {


  @Input() scheduledMessage: string;
  @Input() scheduledAttachments: any[];
  @Input() channelUuid: string;
  @Input() channelName: string;
  uploadedFile: any;
  uploading: boolean;
  selectedDate: string;
  selectedTime: string;
  sending: boolean;
  invalidDateTime: boolean;
  createdMessage: Message;

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
    const today = new Date();
    this.uploading = false;
    this.sending = false;
    this.selectedDate = today.toLocaleDateString();
    this.selectedTime = (today.getHours() < 10 ? '0' : '') + today.getHours() + ':00';
    this.uploadedFile = null;
    this.invalidDateTime = false;
    this.createdMessage = null;
  }

  /**
   * This will cloase the group chat popup
   */
  close() {
    this.modalController.dismiss({
      messageScheduled: this.createdMessage ? true : false
    });
  }

  validateDateTime() {
    this.invalidDateTime = !this.isValidDateTime(`${this.selectedDate} ${this.selectedTime}`);
  }

  scheduleMessage() {
    if (!this.selectedDate || !this.selectedTime || !this.channelUuid) {
      return;
    }
    this.sending = true;
    const dateObj = new Date(`${this.selectedDate} ${this.selectedTime}`);
    if (this.isValidDateTime(`${this.selectedDate} ${this.selectedTime}`)) {
      this.chatService.postNewMessage({
        channelUuid: this.channelUuid,
        message: this.scheduledMessage,
        file: JSON.stringify(this.scheduledAttachments[0]),
        scheduled: dateObj.toISOString()
      }).subscribe(
        response => {
          this.createdMessage = response;
          this.sending = false;
        },
        error => {
          console.log(error);
          this.sending = false;
        }
      );
    } else {
      this.sending = false;
    }
  }

  async uploadAttachment() {
    const type = 'any';
    const options: any = {};

    if (this.filestackService.getFileTypes(type)) {
      options.accept = this.filestackService.getFileTypes(type);
      options.storeTo = this.filestackService.getS3Config(type);
    }
    await this.filestackService.open(
      options,
      res => {
        this.uploadedFile = res;
        return;
      },
      err => {
        console.log(err);
      }
    );
  }

  previewFile(file) {
    return this.filestackService.previewFile(file);
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
