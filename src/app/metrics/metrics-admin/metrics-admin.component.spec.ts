import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsAdminComponent } from './metrics-admin.component';

describe('MetricsAdminComponent', () => {
  let component: MetricsAdminComponent;
  let fixture: ComponentFixture<MetricsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricsAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
