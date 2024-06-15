import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from '@app/shared/services/storage.service';
import { ChatService, ChatChannel, ChannelCreatePopupParam } from '@app/chat/chat.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-group-chat-popup',
  templateUrl: './group-chat-popup.component.html',
  styleUrls: ['./group-chat-popup.component.scss'],
})
export class GroupChatPopupComponent implements OnInit {

  createdChannels: ChannelCreatePopupParam;

  isCohortChecked: boolean;
  cohortChatDisabled: boolean;
  creating: boolean;

  constructor(
    public modalController: ModalController,
    private chatService: ChatService,
    public storage: StorageService
  ) { }

  ngOnInit() {
    this._initialise();
    this._handelCreatedChannels();
  }

  /**
   * This will cloase the group chat popup
   */
  close() {
    this.modalController.dismiss({
      newChannels: null
    });
  }

  private _initialise() {
    this.creating = false;
    this.isCohortChecked = false;
    this.cohortChatDisabled = false;
  }

  private _handelCreatedChannels() {
    if (!this.createdChannels) {
      return;
    }
    if (this.createdChannels.cohortChannel) {
      this.isCohortChecked = true;
      this.cohortChatDisabled = true;
    }
  }

  /**
 * This call chat service to create group channel
 */
  async createChatChannels() {
    const currentExperience = this.storage.get('experience');
    this.creating = true;
    if (this.isCohortChecked) {
      this.chatService.createChannel({
        name: currentExperience.name,
        isAnnouncement: false,
        roles: ['participant', 'mentor', 'admin', 'coordinator'],
        members: [{
          type: 'Timeline',
          uuid: this.storage.timelineUuid
        }]
      }).subscribe(chat => {
        this.creating = false;
        this.modalController.dismiss({
          newChannel: chat
        });
      }, err => { });
    }
  }

}
