import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import { PusherService } from '@shared/pusher/pusher.service';
import { UtilsService } from '@services/utils.service';

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy, pusherServiceSpy, routerSpy, utilSpy;

  beforeEach(waitForAsync(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    pusherServiceSpy = jasmine.createSpyObj('PusherService', ['initialise']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    utilSpy = jasmine.createSpyObj('UtilsService', ['getIpLocation']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Platform, useValue: platformSpy },
        { provide: PusherService, useValue: pusherServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UtilsService, useValue: utilSpy },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    pusherServiceSpy.initialise.and.returnValue(new Promise(() => {}));
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!

});
