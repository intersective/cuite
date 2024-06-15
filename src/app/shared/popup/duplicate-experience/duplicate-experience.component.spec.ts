import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { SharedModule } from '@shared/shared.module';
import { DuplicateExperienceComponent } from './duplicate-experience.component';
import { ModalController } from '@ionic/angular';
import { UtilsService } from '@services/utils.service';
import { OverviewService } from '../../../overview/overview.service';

describe('DuplicateExperienceComponent', () => {
  let component: DuplicateExperienceComponent;
  let fixture: ComponentFixture<DuplicateExperienceComponent>;
  const modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
  const utilsSpy = jasmine.createSpyObj('UtilsService', ['broadcastEvent']);
  const overviewSpy = jasmine.createSpyObj('OverviewService', ['duplicateExperience', 'duplicateExperienceUrl']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ DuplicateExperienceComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ModalController,
          useValue: modalSpy,
        },
        {
          provide: UtilsService,
          useValue: utilsSpy,
        },
        {
          provide: OverviewService,
          useValue: overviewSpy,
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateExperienceComponent);
    component = fixture.componentInstance;
    utilsSpy.broadcastEvent = jasmine.createSpy().and.returnValue(of(true));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('for select()', () => {
    it('select all when all selected', () => {
      component.roleSelected = {
        author: true,
        coordinator: true,
        expert: true,
        learner: true,
      };
      component.select('all');
      expect(component.roleSelected).toEqual({
        author: false,
        coordinator: false,
        expert: false,
        learner: false,
      });
      expect(component.allSelected).toEqual(false);
    });

    it('select all when not all selected', () => {
      component.roleSelected = {
        author: true,
        coordinator: false,
        expert: true,
        learner: true,
      };
      component.select('all');
      expect(component.roleSelected).toEqual({
        author: true,
        coordinator: true,
        expert: true,
        learner: true,
      });
      expect(component.allSelected).toEqual(true);
    });

    it('select one role when not all selected', () => {
      component.roleSelected = {
        author: true,
        coordinator: false,
        expert: true,
        learner: true,
      };
      component.select();
      expect(component.roleSelected).toEqual({
        author: true,
        coordinator: false,
        expert: true,
        learner: true,
      });
      expect(component.allSelected).toEqual(false);
    });

    it('select one role when all selected', () => {
      component.roleSelected = {
        author: true,
        coordinator: true,
        expert: true,
        learner: true,
      };
      component.select();
      expect(component.roleSelected).toEqual({
        author: true,
        coordinator: true,
        expert: true,
        learner: true,
      });
      expect(component.allSelected).toEqual(true);
    });
  });

  it('for confirmed()', () => {
    overviewSpy.duplicateExperienceUrl = jasmine.createSpy().and.returnValue(of('test-url'));
    component.confirmed();
    expect(utilsSpy.broadcastEvent).toHaveBeenCalledTimes(1);
    expect(overviewSpy.duplicateExperienceUrl).toHaveBeenCalled();
  });

  it('for cancel()', () => {
    component.cancel();
    expect(modalSpy.dismiss).toHaveBeenCalled();
  });
});
