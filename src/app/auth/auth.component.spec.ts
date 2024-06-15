import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { NotificationService } from '@services/notification.service';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { PusherService } from '@app/shared/pusher/pusher.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let routerSpy, activeRouterSpy, authServiceSpy, notificationServiceSpy, pusherServiceSpy;

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['directLogin']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['alert']);
    pusherServiceSpy = jasmine.createSpyObj('PusherService', ['initialise']);
    TestBed.configureTestingModule({
      declarations: [ AuthComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                token: '1234',
                redirect: 'abc'
              })
            },
            params: of(true),
          }
        },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: PusherService, useValue: pusherServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    authServiceSpy.directLogin.and.returnValue(of({}));
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    activeRouterSpy = TestBed.inject(ActivatedRoute);
    pusherServiceSpy.initialise = jasmine.createSpy().and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
