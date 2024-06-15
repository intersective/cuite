import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { SubmissionChartComponent } from './submission-chart.component';
import { SubmissionChartService } from './submission-chart.service';
import { UtilsService } from '@services/utils.service';

describe('SubmissionChartComponent', () => {
  let component: SubmissionChartComponent;
  let fixture: ComponentFixture<SubmissionChartComponent>;
  let serviceSpy;
  let utilSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionChartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: SubmissionChartService,
          useValue: jasmine.createSpyObj('ProgressTableService', ['getSubmissions'])
        },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj('UtilsService', ['utcToLocal'])
        }
      ]
    })
    .compileComponents();
    serviceSpy = TestBed.inject(SubmissionChartService);
    utilSpy = TestBed.inject(UtilsService);
  }));

  beforeEach(() => {
    serviceSpy.getSubmissions.and.returnValue(of({
      data: [
        {
          name: '',
          value: ''
        }
      ]
    }));
    fixture = TestBed.createComponent(SubmissionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
