import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricComponent } from './metric-card.component';

describe('MetricComponent', () => {
  let component: MetricComponent;
  let fixture: ComponentFixture<MetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
