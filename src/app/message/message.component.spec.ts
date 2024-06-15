import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { MessageComponent } from './message.component';
import { StorageService } from '@services/storage.service';
import { Router, NavigationEnd } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { MessageService } from './message.service';
import { NotificationService } from '@services/notification.service';

class SpyObject {
  constructor(type?: any) {
    if (type) {
      for (const prop in type.prototype) {
        if (prop) {
          let m: any = null;
          try {
            m = type.prototype[prop];
          } catch (e) {
            // As we are creating spys for abstract classes,
            // these classes might have getters that throw when they are accessed.
            // As we are only auto creating spys for methods, this
            // should not matter.
          }
          if (typeof m === 'function') {
            this.spy(prop);
          }
        }
      }
    }
  }

  spy(name: string) {
    if (!(this as any)[name]) {
      (this as any)[name] = jasmine.createSpy(name);
    }
    return (this as any)[name];
  }

  prop(name: string, value: any) { (this as any)[name] = value; }

}

class MockRouter extends SpyObject {
  navigate;
  events;
  url;

  constructor() {
    super(Router);
    const TEST_EVENT: NavigationEnd = {
      id: 1,
      url: '/test',
      urlAfterRedirects: 'test/test',
    };

    this.navigate = this.spy('navigate');
    this.events = of(new NavigationEnd(
      TEST_EVENT.id,
      TEST_EVENT.url,
      TEST_EVENT.urlAfterRedirects,
    ));
    this.url = 'abc';
  }
}

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let storageSpy;
  let routerSpy;
  let LoadingControllerSpy;
  let serviceSpy;
  let notificationSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: StorageService,
          useValue: jasmine.createSpyObj('StorageService', ['get'])
        },
        {
          provide: Router,
          useValue: MockRouter
        },
        {
          provide: LoadingController,
          useValue: jasmine.createSpyObj('LoadingController', ['create'])
        },
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj('MessageService', ['getMessageTemplates', 'sendMessage'])
        },
        {
          provide: NotificationService,
          useValue: jasmine.createSpyObj('NotificationService', ['alert'])
        }
      ]
    })
    .compileComponents();
    storageSpy = TestBed.inject(StorageService);
    routerSpy = TestBed.inject(Router);
    LoadingControllerSpy = TestBed.inject(LoadingController);
    serviceSpy = TestBed.inject(MessageService);
    notificationSpy = TestBed.inject(NotificationService);
  }));

  beforeEach(() => {
    storageSpy.get.and.returnValue({
      users: []
    });
    serviceSpy.getMessageTemplates.and.returnValue(of([
      {
        name: '',
        sms: '',
        email: ''
      }
    ]));
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO still didn't found a way to fix comment for now.
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
