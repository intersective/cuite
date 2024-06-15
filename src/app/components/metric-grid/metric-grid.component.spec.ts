import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { MetricGridComponent } from './metric-grid.component';
import { MetricGridService } from './metric-grid.service';

describe('MetricGridComponent', () => {
  let component: MetricGridComponent;
  let fixture: ComponentFixture<MetricGridComponent>;
  let serviceSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricGridComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MetricGridService,
          useValue: jasmine.createSpyObj('MetricGridService', ['getStatistics'])
        }
      ]
    })
    .compileComponents();
    serviceSpy = TestBed.inject(MetricGridService);
  }));

  beforeEach(() => {
    serviceSpy.getStatistics.and.returnValue(of({}));
    fixture = TestBed.createComponent(MetricGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
