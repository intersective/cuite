import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {TemplateCategoryCardComponent} from './template-category-card.component';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {By} from '@angular/platform-browser';

describe('TemplateCategoryCardComponent', () => {
  let component: TemplateCategoryCardComponent;
  let fixture: ComponentFixture<TemplateCategoryCardComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  const category = {
    'leadImage': '',
    'name': 'Team Projects',
    'id': 'team project',
    'description': 'This is a description',
    'color': 'rgba(0,64,229, 0.7)',
    'isLarge': true
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        {
          provide: Router,
          useValue: routerSpy
        },
      ],
      declarations: [ TemplateCategoryCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateCategoryCardComponent);
    component = fixture.componentInstance;
    component.category = category;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render category name',  () => {
    expect(fixture.debugElement.query(By.css('.category-card-title-container > span')).nativeElement.innerText).toEqual(category.name);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
