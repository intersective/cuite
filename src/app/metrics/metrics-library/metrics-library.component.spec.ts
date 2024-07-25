import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsLibraryComponent } from './metrics-library.component';

describe('MetricsLibraryComponent', () => {
  let component: MetricsLibraryComponent;
  let fixture: ComponentFixture<MetricsLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricsLibraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
