import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DirectChatComponent } from './direct-chat.component';
import { Apollo } from 'apollo-angular';
import { ModalController } from '@ionic/angular';
import { StorageService } from '@app/shared/services/storage.service';
import { ChatService } from '../chat.service';
import { AuthService } from '@app/auth/auth.service';
import { of } from 'rxjs';

describe('DirectChatComponent', () => {
  let component: DirectChatComponent;
  let fixture: ComponentFixture<DirectChatComponent>;
  let chatServiceSpy: jasmine.SpyObj<ChatService>;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const modalSpy = jasmine.createSpyObj('Modal', ['present', 'onDidDismiss']);
  modalSpy.onDidDismiss.and.returnValue(new Promise(() => {}));
  const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
  modalCtrlSpy.dismiss.and.returnValue(modalSpy);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectChatComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        Apollo,
        StorageService,
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['getUserEnrolmentUuid'])
        },
        {
          provide: ChatService,
          useValue: jasmine.createSpyObj('ChatService', ['searchTimelineUsers', 'createChannel'])
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectChatComponent);
    component = fixture.componentInstance;
    chatServiceSpy = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    storageSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const mockTimelineUsers = [
    {
      uuid: '60712b63-95c8-bffe-ba86-784f1c0f6426',
      name: 'coordinator+02',
      email: 'coordinator+02@practera.com',
      role: 'coordinator',
      avatar: 'https://www.gravatar.com/avatar/aeded3a2d9242b1c8144ea079f1acc42?d=https://sandbox.practera.com/img/user-512.png&s=50',
      enrolmentUuid: '5f9f92b4-2fa0-468d-9000-185dac110002',
      team: null
    },
    {
      uuid: '73fbb872-9658-9543-bdb4-ac85a6a253ab',
      name: 'mentor+04',
      email: 'mentor+04@practera.com',
      role: 'mentor',
      avatar: 'https://www.gravatar.com/avatar/fc4b6bea10864603ffc693a27fca6d78?d=https://sandbox.practera.com/img/user-512.png&s=50',
      enrolmentUuid: '0c389a89-722b-99ff-8d25-3debb9e2f17e',
      team: {
        uuid: '5f9f938f-392c-4424-a1bd-15f1ac110002',
        name: 'Team 2'
      }
    },
    {
      uuid: '8bee29d0-bf45-af7d-0927-19a73a7e1840',
      name: 'student+02',
      email: 'student+02@practera.com',
      role: 'participant',
      avatar: 'https://www.gravatar.com/avatar/db30b12260b2c589b1394b26390eab50?d=https://sandbox.practera.com/img/user-512.png&s=50',
      enrolmentUuid: '436b9500-5fbf-7175-72c3-ee661b5c99b0',
      team: {
        uuid: '5f927d94-1718-44b7-9996-5cf8ac110002',
        name: 'Team 1'
      }
    },
    {
      uuid: '8d1f3cdf-d697-e957-7120-b5568159a978',
      name: 'student+01',
      email: 'student+01@practera.com',
      role: 'participant',
      avatar: 'https://www.gravatar.com/avatar/21b7427270a606e8a3c4413a13bb47c6?d=https://sandbox.practera.com/img/user-512.png&s=50',
      enrolmentUuid: 'e1a2aa12-bb1f-71c9-0ad5-fe5a56d635f9',
      team: {
        uuid: '5f927d94-1718-44b7-9996-5cf8ac110002',
        name: 'Team 1'
      }
    },
    {
      uuid: '158c470c-64df-c3b1-db5d-82b1db2f263d',
      name: 'coordinator+01',
      email: 'coordinator+01@practera.com',
      role: 'coordinator',
      avatar: 'https://www.gravatar.com/avatar/432005178fd530c00c9ac7ace134fe7d?d=https://sandbox.practera.com/img/user-512.png&s=50',
      enrolmentUuid: '52c0eee1-ca1e-f8e2-9693-95ffa14070d1',
      team: null
    },
    {
      uuid: '9b96af23-e7e0-5d19-2d71-e0064c895a8d',
      name: 'mentor+02',
      email: 'mentor+02@practera.com',
      role: 'mentor',
      avatar: 'https://www.gravatar.com/avatar/c9cdff7fef088b13e2b75a4ad7dddc95?d=https://sandbox.practera.com/img/user-512.png&s=50',
      enrolmentUuid: '3a2e3b7a-fcc1-e1e8-cf37-7989753dd438',
      team: {
        uuid: '5f9f938f-392c-4424-a1bd-15f1ac110002',
        name: 'Team 2'
      }
    }
  ];

  describe('when testing ngOnInit()', () => {
    it(`should call auth service to get enrolment Uuid if storage didn't have it`, () => {
      spyOn(storageSpy, 'getUser').and.returnValue({});
      authServiceSpy.getUserEnrolmentUuid.and.returnValue(of({
        enrolmentUuid: 'dfnuewfjiefj'
      }));
      component.ngOnInit();
      expect(authServiceSpy.getUserEnrolmentUuid.calls.count()).toBe(1);
    });
    it(`should get enrolment Uuid if storage have it`, () => {
      spyOn(storageSpy, 'getUser').and.returnValue({enrolmentUuid: 'dfnuewfjiefj'});
      component.ngOnInit();
      expect(component.currentEnrolmentUuid).toEqual('dfnuewfjiefj');
    });
  });

  describe('when testing close()', () => {
    it(`should call modalController dismiss`, () => {
      component.close();
      expect(modalCtrlSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('when testing searchUsers()', () => {
    it(`should call chatService to get correct data`, () => {
      spyOn(storageSpy, 'getUser').and.returnValue({
        timelineUuid: 'dnuefef'
      });
      chatServiceSpy.searchTimelineUsers.and.returnValue(of(mockTimelineUsers));
      component.searchText = 'ABC';
      component.searchUsers();
      expect(chatServiceSpy.searchTimelineUsers.calls.count()).toBe(1);
    });
    it(`should not call chatService if searchText is empty`, () => {
      spyOn(storageSpy, 'getUser').and.returnValue({
        timelineUuid: 'dnuefef'
      });
      chatServiceSpy.searchTimelineUsers.and.returnValue(of(mockTimelineUsers));
      component.searchText = '';
      component.searchUsers();
      expect(chatServiceSpy.searchTimelineUsers.calls.count()).toBe(0);
      expect(component.userList).toEqual([]);
    });
  });

  describe('when testing createChatChannel()', () => {
    it(`should call chatService to create new channel`, () => {
      const user = {
        name: 'user 1',
        role: 'mentor',
        enrolmentUuid: '232neff'
      };
      spyOn(storageSpy, 'getUser').and.returnValue({
        role: 'mentor'
      });
      component.currentEnrolmentUuid = 'wefn34f934g';
      chatServiceSpy.createChannel.and.returnValue(of(
        {
          uuid: '1234',
          name: 'ABC channel',
          avatar: 'https://flaticons.net/icon.php?slug_category=people&slug_icon=user-group',
          pusherChannel: 'private-develop-team-1447-322-20',
          isAnnouncement: false,
          isDirectMessage: false,
          readonly: false,
          roles: ['mentor'],
          canEdit: true,
          unreadMessageCount: 0,
          lastMessage: null,
          lastMessageCreated: null,
          scheduledMessageCount: 0
        }
      ));
      component.createChatChannel(user);
      expect(chatServiceSpy.createChannel.calls.count()).toBe(1);
    });
  });
});
