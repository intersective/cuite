import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MetricPaneComponent } from './metric-pane.component';

describe('MetricPaneComponent', () => {
  let component: MetricPaneComponent;
  let fixture: ComponentFixture<MetricPaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
