import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActionPopoverComponent } from './action-popover.component';
import { PopoverController } from '@ionic/angular';

describe('ActionPopoverComponent', () => {
  let component: ActionPopoverComponent;
  let fixture: ComponentFixture<ActionPopoverComponent>;
  let popoverSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPopoverComponent ],
      providers: [
        {
          provide: PopoverController,
          useValue: jasmine.createSpyObj('PopoverController', ['dismiss'])
        }
      ]
    })
    .compileComponents();
    popoverSpy = TestBed.inject(PopoverController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
