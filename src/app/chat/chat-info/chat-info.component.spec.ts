import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Directive } from '@angular/core';
import { Router } from '@angular/router';

import { ChatInfoComponent } from './chat-info.component';
import { Apollo } from 'apollo-angular';
import { ModalController } from '@ionic/angular';
import { StorageService } from '@app/shared/services/storage.service';
import { ChatService } from '../chat.service';
import { NotificationService } from '@services/notification.service';
import { of } from 'rxjs';

describe('ChatInfoComponent', () => {
  let component: ChatInfoComponent;
  let fixture: ComponentFixture<ChatInfoComponent>;
  let chatServiceSpy: jasmine.SpyObj<ChatService>;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  const modalSpy = jasmine.createSpyObj('Modal', ['present', 'onDidDismiss']);
  modalSpy.onDidDismiss.and.returnValue(new Promise(() => {}));
  const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss', 'create']);
  modalCtrlSpy.create.and.returnValue(modalSpy);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatInfoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        Apollo,
        NotificationService,
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },
        {
          provide: ChatService,
          useValue: jasmine.createSpyObj('ChatService', ['getChatMembers', 'editChatChannel'])
        },
        {
          provide: StorageService,
          useValue: jasmine.createSpyObj('StorageService', ['getCurrentChatChannel', 'getUser'])
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInfoComponent);
    component = fixture.componentInstance;
    chatServiceSpy = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    storageSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    notificationSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  const mockMembers = [
    {
      uuid: '1',
      name: 'student+01',
      role: 'participant',
      avatar: 'https://www.gravatar.com/avatar/21b7427270a606e8a3c4413a13bb47c6?d=https://sandbox.practera.com/img/user-512.png&s=50',
      email: ''
    },
    {
      uuid: '2',
      name: 'student1',
      role: 'participant',
      avatar: 'https://www.gravatar.com/avatar/21b7427270a606e8a3c4413a13bb47c6?d=https://sandbox.practera.com/img/user-512.png&s=50',
      email: ''
    },
    {
      uuid: '3',
      name: 'student2',
      role: 'participant',
      avatar: 'https://www.gravatar.com/avatar/21b7427270a606e8a3c4413a13bb47c6?d=https://sandbox.practera.com/img/user-512.png&s=50',
      email: ''
    }
  ];

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when testing ngOnInit()', () => {
    it(`should call chat service to get memeber list`, () => {
      chatServiceSpy.getChatMembers.and.returnValue(of(mockMembers));
      component.selectedChat = {
        uuid: '35326928',
        name: 'Team 1',
        avatar: 'https://sandbox.practera.com/img/team-white.png',
        pusherChannel: 'sdb746-93r7dc-5f44eb4f',
        isAnnouncement: false,
        isDirectMessage: false,
        readonly: false,
        roles: [
          'participant',
          'coordinator',
          'admin'
        ],
        unreadMessageCount: 0,
        lastMessage: null,
        lastMessageCreated: null,
        canEdit: false,
        scheduledMessageCount: 0
      };
      component.ngOnInit();
      expect(chatServiceSpy.getChatMembers.calls.count()).toBe(1);
    });
  });

  describe('when testing checkNamechanged()', () => {
    it(`should enable save it channel name changed`, () => {
      const event = {
        target: {
          value: '123'
        }
      };
      component.selectedChat = {
        uuid: '1234',
        name: 'cohort channel name',
        avatar: 'https://flaticons.net/icon.php?slug_category=people&slug_icon=user-group',
        pusherChannel: 'private-develop-team-1447-322-20',
        isAnnouncement: false,
        isDirectMessage: false,
        readonly: false,
        roles: ['participant', 'mentor'],
        canEdit: true,
        unreadMessageCount: 0,
        lastMessage: null,
        lastMessageCreated: null,
        scheduledMessageCount: 0
      };
      component.checkNamechanged(event);
      expect(component.enableSave).toBeTruthy();
    });
  });

  describe('when testing editChannelDetail()', () => {
    it(`should call chatService to save new channel details`, () => {
      const editResponse = {
        uuid: '1234',
        name: 'ABC channel',
        avatar: 'https://flaticons.net/icon.php?slug_category=people&slug_icon=user-group',
        pusherChannel: 'private-develop-team-1447-322-20',
        isAnnouncement: false,
        isDirectMessage: false,
        readonly: false,
        roles: ['participant', 'mentor'],
        canEdit: true,
        unreadMessageCount: 0,
        lastMessage: null,
        lastMessageCreated: null,
        scheduledMessageCount: 0
      };
      component.channelName = 'ABC channel';
      component.selectedChat = {
        uuid: '1234',
        name: 'cohort channel name',
        avatar: 'https://flaticons.net/icon.php?slug_category=people&slug_icon=user-group',
        pusherChannel: 'private-develop-team-1447-322-20',
        isAnnouncement: false,
        isDirectMessage: false,
        readonly: false,
        roles: ['participant', 'mentor'],
        canEdit: true,
        unreadMessageCount: 0,
        lastMessage: null,
        lastMessageCreated: null,
        scheduledMessageCount: 0
      };
      chatServiceSpy.editChatChannel.and.returnValue(of(editResponse));
      component.editChannelDetail();
      expect(chatServiceSpy.editChatChannel.calls.count()).toBe(1);
    });
  });

});
