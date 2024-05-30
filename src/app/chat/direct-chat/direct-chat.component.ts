import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from '@app/shared/services/storage.service';
import { ChatService, ChatChannel, ChannelMembers, SearchUsersParam, User } from '@app/chat/chat.service';
import { AuthService } from '@app/auth/auth.service';
import { UtilsService } from '@services/utils.service';

const searchScope = 'timeline';
const chatMemberUuidType = 'Enrolment';

@Component({
  selector: 'app-direct-chat',
  templateUrl: './direct-chat.component.html',
  styleUrls: ['./direct-chat.component.scss'],
})
export class DirectChatComponent implements OnInit {

  searchText: string;
  userList: User[] = [];
  loadingUsers: Boolean = false;
  currentEnrolmentUuid: string;

  constructor(
    public modalController: ModalController,
    private chatService: ChatService,
    public storage: StorageService,
    private authService: AuthService,
    public utils: UtilsService
  ) { }

  ngOnInit() {
    this._initialise();
  }

  /**
   * This will cloase the direct chat popup
   */
  close() {
    this.modalController.dismiss({
      newChannel: null
    });
  }

  /**
   * Initialise all variables
   * and if enrolmentUuid not in the storage will call _getEnrolmentUuid to get it from auth service.
   */
  private _initialise() {
    this.searchText = '';
    this.userList = [];
    this.loadingUsers = false;
    if (this.storage.getUser().enrolmentUuid) {
      this.currentEnrolmentUuid = this.storage.getUser().enrolmentUuid;
    } else {
      this._getEnrolmentUuid();
    }
  }

  /**
   * Calling auth service to get current user enrolmentUuid
   */
  private _getEnrolmentUuid() {
    this.authService.getUserEnrolmentUuid().subscribe(
      (response) => {
        if (!response.enrolmentUuid) {
          return;
        }
        this.currentEnrolmentUuid = response.enrolmentUuid;
        this.storage.setUser({
          enrolmentUuid: response.enrolmentUuid
        });
      },
      error => {}
    );
  }

  /**
   * call chat service to get timeline user list
   */
  searchUsers() {
    this.loadingUsers = true;
    if (this.searchText === '') {
      this.loadingUsers = false;
      this.userList = [];
      return;
    }
    const searchParam: SearchUsersParam = {
      scope: searchScope,
      scopeUuid: this.storage.timelineUuid,
      filter: this.searchText,
      teamUserOnly: true
    };

    this.chatService.searchTimelineUsers(searchParam).subscribe(
      (response) => {
        this.loadingUsers = false;
        if (!response || response.length === 0) {
          return;
        }
        this.userList = response;
      },
      error => {}
    );
  }

  /**
   * This call chat service to create direct channel with a selected user.
   * @param user selected user object
   */
  createChatChannel(user) {
    const currentUserRole = this.storage.getUser().role;
    const adminRole = (currentUserRole === 'inst_admin') || (currentUserRole === 'cs_admin') ? 'admin' : currentUserRole;
    this.chatService.createChannel({
      name: user.name,
      isAnnouncement: false,
      roles: [user.role, adminRole],
      members: [{
        type: chatMemberUuidType,
        uuid: this.currentEnrolmentUuid
      }, {
        type: chatMemberUuidType,
        uuid: user.enrolmentUuid
      }]
    }).subscribe(chat => {
      this.modalController.dismiss({
        newChannel: chat
      });
    }, err => { });
  }

}
