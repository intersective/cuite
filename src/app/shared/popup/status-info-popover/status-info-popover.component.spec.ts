import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusInfoPopoverComponent } from './status-info-popover.component';

describe('StatusInfoPopoverComponent', () => {
  let component: StatusInfoPopoverComponent;
  let fixture: ComponentFixture<StatusInfoPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusInfoPopoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusInfoPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
