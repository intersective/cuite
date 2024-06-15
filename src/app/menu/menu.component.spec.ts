import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { MenuService } from './menu.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { StorageService } from '@services/storage.service';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let serviceSpy;
  let routerSpy;
  let storageSpy;
  let loadingControllerSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MenuService,
          useValue: jasmine.createSpyObj('MenuService', ['switchTimeline'])
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        },
        {
          provide: LoadingController,
          useValue: jasmine.createSpyObj('LoadingController', ['create'])
        },
        {
          provide: StorageService,
          useValue: jasmine.createSpyObj('StorageService', ['getUser', 'get'])
        }
      ]
    })
    .compileComponents();
    serviceSpy = TestBed.inject(MenuService);
    routerSpy = TestBed.inject(Router);
    loadingControllerSpy = TestBed.inject(LoadingController);
    storageSpy = TestBed.inject(StorageService);
  }));

  beforeEach(() => {
    storageSpy.getUser.and.returnValue({
      timelineId: 1
    });
    storageSpy.get.and.returnValue([]);
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
