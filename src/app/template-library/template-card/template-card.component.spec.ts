import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateCardComponent } from './template-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('TemplateCardComponent', () => {
  let component: TemplateCardComponent;
  let fixture: ComponentFixture<TemplateCardComponent>;

  const template = {
    uuid: '000f562e-0ed0-4afe-af53-7a8d20558ce1',
    name: 'Consulting Project Experience',
    description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
    leadImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2252&q=80',
    leadVideoUrl: 'https://cdn.videvo.net/videvo_files/video/free/2013-08/small_watermarked/hd0992_preview.webm',
    type: 'work simulation',
    attributes: ['teambased projects', '12-weeks', 'feedback loops'],
    designMapUrl: '/assets/icon/favicon.png',
    operationsManualUrl: '/assets/icon/logo.svg',
    isPublic: false
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ TemplateCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateCardComponent);
    component = fixture.componentInstance;
    component.template = template;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the skeletons when skeleton is set to true', () => {
    component.skeleton = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-skeleton-text'))).toBeTruthy();
  });

  it('should not render the skeletons when skeleton is set to false', () => {
    component.skeleton = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-skeleton-text'))).toBeNull();
  });

  it('should render the template\'s title', () => {
    expect(fixture.debugElement.query(By.css('.template-card-title')).nativeElement.innerText).toEqual(template.name);
  });

  it('should render custom template chip when the template is not public', () => {
    component.template.isPublic = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-custom-template-chip'))).toBeTruthy();
  });

  it('should not render custom template chip when the template is public', () => {
    component.template.isPublic = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-custom-template-chip'))).toBeNull();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
