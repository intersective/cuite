import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { SharedModule } from '@shared/shared.module';
import { DescriptionComponent } from './description.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

describe('DescriptionComponent', () => {
  let component: DescriptionComponent;
  let fixture: ComponentFixture<DescriptionComponent>;
  const modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ DescriptionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ModalController,
          useValue: modalSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('for comfirmed()', () => {
    it('without redirect', () => {
      component.redirect = null;
      component.confirmed();
      expect(modalSpy.dismiss).toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('with redirect', () => {
      component.redirect = ['/abc'];
      component.confirmed();
      expect(modalSpy.dismiss).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalled();
    });
  });

});
