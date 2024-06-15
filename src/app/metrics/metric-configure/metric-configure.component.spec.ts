import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricConfigureComponent } from './metric-configure.component';

describe('MetricConfigureComponent', () => {
  let component: MetricConfigureComponent;
  let fixture: ComponentFixture<MetricConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricConfigureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
