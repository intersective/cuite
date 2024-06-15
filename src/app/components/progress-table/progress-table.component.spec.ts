import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProgressTableComponent } from './progress-table.component';
import { ProgressTableService } from './progress-table.service';
import { PopoverController } from '@ionic/angular';
import { UtilsService } from '@services/utils.service';

describe('ProgressTableComponent', () => {
  let component: ProgressTableComponent;
  let fixture: ComponentFixture<ProgressTableComponent>;
  let serviceSpy;
  let popoverSpy;
  let utilSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressTableComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ProgressTableService,
          useValue: jasmine.createSpyObj('ProgressTableService', ['getEnrolments', 'getTeams'])
        },
        {
          provide: PopoverController,
          useValue: jasmine.createSpyObj('PopoverController', ['create'])
        },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj('UtilsService', ['timeComparer', 'getEvent'])
        }
      ]
    })
    .compileComponents();
    serviceSpy = TestBed.inject(ProgressTableService);
    popoverSpy = TestBed.inject(PopoverController);
    utilSpy = TestBed.inject(UtilsService);
  }));

  beforeEach(() => {
    utilSpy.getEvent.and.returnValue(of({}));
    serviceSpy.getEnrolments.and.returnValue(of({
      data: []
    }));
    fixture = TestBed.createComponent(ProgressTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
