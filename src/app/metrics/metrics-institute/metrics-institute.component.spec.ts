import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsInstituteComponent } from './metrics-institute.component';

describe('MetricsInstituteComponent', () => {
  let component: MetricsInstituteComponent;
  let fixture: ComponentFixture<MetricsInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricsInstituteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
