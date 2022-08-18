import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScheduleMessagePopupComponent } from './edit-schedule-message-popup.component';

describe('EditScheduleMessagePopupComponent', () => {
  let component: EditScheduleMessagePopupComponent;
  let fixture: ComponentFixture<EditScheduleMessagePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditScheduleMessagePopupComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditScheduleMessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
