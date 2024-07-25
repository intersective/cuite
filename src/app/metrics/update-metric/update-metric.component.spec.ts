import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMetricComponent } from './update-metric.component';

describe('UpdateMetricComponent', () => {
  let component: UpdateMetricComponent;
  let fixture: ComponentFixture<UpdateMetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMetricComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
