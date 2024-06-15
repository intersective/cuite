import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceDownloadCardComponent } from './resource-download-card.component';
import { By } from '@angular/platform-browser';

describe('ResourceDownloadCardComponent', () => {
  let component: ResourceDownloadCardComponent;
  let fixture: ComponentFixture<ResourceDownloadCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceDownloadCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceDownloadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton when skeleton is set to true', () => {
    component.skeleton = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-skeleton-text'))).toBeTruthy();
  });

  it('should not render skeleton when skeleton is set to false', () => {
    component.skeleton = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-skeleton-text'))).toBeNull();
  });

  it('should not render skeleton when skeleton is set to false', () => {
    const prompt = 'This is the prompt';
    component.skeleton = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-skeleton-text'))).toBeNull();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
