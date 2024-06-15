import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmptyResultsComponent } from './empty-results.component';
import { By } from '@angular/platform-browser';

describe('EmptyResultsComponent', () => {
  let component: EmptyResultsComponent;
  let fixture: ComponentFixture<EmptyResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyResultsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyResultsComponent);
    component = fixture.componentInstance;
    component.emptyResultsString = 'No results';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the empty results string', () => {
    const noResultsString = 'There are no results';
    component.emptyResultsString = noResultsString;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.heading-5')).nativeElement.innerText).toEqual(noResultsString);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
