import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { SharedModule } from '@shared/shared.module';
import { TagsComponent } from './tags.component';
import { TagsService } from './tags.service';
import { ModalController } from '@ionic/angular';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;
  const serviceSpy = jasmine.createSpyObj('TagsService', ['getTagsBy', 'updateExperienceTags']);
  const modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ TagsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: TagsService,
          useValue: serviceSpy,
        },
        {
          provide: ModalController,
          useValue: modalSpy,
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('for search()', () => {
    let term;
    let response;
    let expectedResult;
    afterEach(() => {
      serviceSpy.getTagsBy = jasmine.createSpy().and.returnValue(of(response));
      component.search(of(term)).subscribe(res => expect(res).toEqual(expectedResult));
    });

    it('not search when term is less than 2 letters', () => {
      term = 'a';
      response = ['tag1', 'tag2'];
      expectedResult = [];
    });

    it('response contains term', () => {
      term = 'ta';
      response = ['tag1', 'ta', 'tag2'];
      expectedResult = ['ta', 'tag1', 'tag2'];
    });

    it('response does not contain term', () => {
      term = 'ta';
      response = ['tag1', 'tag2'];
      expectedResult = ['ta', 'tag1', 'tag2'];
    });
  });

  describe('for selected()', () => {
    beforeEach(() => {
      component.tags = ['a', 'b', 'c'];
    });

    it('tags include item', () => {
      component.newTag = 'b';
      component.selected({
        preventDefault: () => {},
        item: 'b'
      });
      expect(component.tags).toEqual(['a', 'b', 'c']);
      expect(component.newTag).toEqual('');
    });

    it('tags not include item', () => {
      component.newTag = 'd';
      component.selected({
        preventDefault: () => {},
        item: 'd'
      });
      expect(component.tags).toEqual(['a', 'b', 'c', 'd']);
      expect(component.newTag).toEqual('');
    });
  });

  it('for remove()', () => {
    component.tags = ['a', 'b', 'c'];
    component.remove('b');
    expect(component.tags).toEqual(['a', 'c']);
  });

  describe('for confirmed()', () => {
    afterEach(() => {
      expect(modalSpy.dismiss).toHaveBeenCalled();
    });

    it('not save', () => {
      component.confirmed(false);
      expect(serviceSpy.updateExperienceTags).not.toHaveBeenCalled();
    });

    it('save for same experience tags', () => {
      component.type = 'experience';
      component.tags = ['a', 'b'];
      component.data = { tags: ['a', 'b'] };
      component.confirmed(true);
      expect(serviceSpy.updateExperienceTags).not.toHaveBeenCalled();
    });

    it('save for different experience tags', () => {
      component.type = 'experience';
      component.tags = ['a', 'b'];
      component.data = { tags: ['a', 'b', 'c'] };
      serviceSpy.updateExperienceTags = jasmine.createSpy().and.returnValue(of({}));
      component.confirmed(true);
      expect(serviceSpy.updateExperienceTags).toHaveBeenCalled();
    });
  });

});
