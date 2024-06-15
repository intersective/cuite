import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import {BrowseTemplatesComponent} from './browse-templates.component';
import {ActivatedRoute} from '@angular/router';
import {TemplateLibraryService} from '../template-library.service';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';

describe('BrowseTemplatesComponent', () => {
  let component: BrowseTemplatesComponent;
  let fixture: ComponentFixture<BrowseTemplatesComponent>;
  const templateLibraryServiceSpy = jasmine.createSpyObj('TemplateLibraryService', ['getTemplatesByFilter', 'getTemplatesByCategory', 'getCustomTemplates']);
  const path = {
    path: ''
  };

  const filterTemplates = [
    {
      uuid: '000f562e-0ed0-4afe-af53-7a8d20558ce1',
      name: 'filterTemplates',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      leadImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2252&q=80',
      leadVideoUrl: '',
      type: 'work simulation',
      isPublic: true
    },
    {
      uuid: '16c3d514-b459-b9d1-05c8-2bd1f582447c',
      name: 'XCELERY 2.0',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      leadImageUrl: 'https://images.unsplash.com/photo-1580391564590-aeca65c5e2d3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
      leadVideoUrl: '',
      type: 'internship',
      isPublic: false
    },
    {
      uuid: '16c3d514-b459-b9d1-05c8-2bd1f582447d',
      name: 'Teamnovation',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      leadImageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2250&q=80',
      leadVideoUrl: '',
      type: 'team project',
      isPublic: true
    }
  ];

  const categoryTemplates = [
    {
      uuid: '000f562e-0ed0-4afe-af53-7a8d20558ce1',
      name: 'categoryTemplates',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      leadImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2252&q=80',
      leadVideoUrl: '',
      type: 'internship',
      isPublic: true
    },
    {
      uuid: '16c3d514-b459-b9d1-05c8-2bd1f582447c',
      name: 'XCELERY 2.0',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      leadImageUrl: 'https://images.unsplash.com/photo-1580391564590-aeca65c5e2d3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
      leadVideoUrl: '',
      type: 'internship',
      isPublic: false
    }
  ];

  const customTemplates = [
    {
      uuid: 'a00f562e-0ed0-4afe-af53-7a8d20558ce1',
      name: 'customTemplates',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      leadImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2252&q=80',
      leadVideoUrl: '',
      type: 'internship',
      isPublic: false
    },
    {
      uuid: 'a6c3d514-b459-b9d1-05c8-2bd1f582447c',
      name: 'XCELERY 2.0',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      leadImageUrl: 'https://images.unsplash.com/photo-1580391564590-aeca65c5e2d3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
      leadVideoUrl: '',
      type: 'internship',
      isPublic: false
    }
  ];

  const params = {
    filter: 'filter string'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseTemplatesComponent ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of(params),
            url: of([path])
          },
        },
        {
          provide: TemplateLibraryService,
          useValue: templateLibraryServiceSpy
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseTemplatesComponent);
    component = fixture.componentInstance;
    templateLibraryServiceSpy.getTemplatesByFilter = jasmine.createSpy().and.returnValue(of(filterTemplates));
    templateLibraryServiceSpy.getTemplatesByCategory = jasmine.createSpy().and.returnValue(of(categoryTemplates));
    templateLibraryServiceSpy.getCustomTemplates = jasmine.createSpy().and.returnValue(of(customTemplates));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get back the category templates', () => {
    path.path = 'custom';
    fixture = TestBed.createComponent(BrowseTemplatesComponent);
    expect(fixture.componentInstance.templates).toBe(customTemplates);
  });

  it('should have isCustomTemplates flag set to true when the path is set to \'custom\'', () => {
    path.path = 'custom';
    fixture = TestBed.createComponent(BrowseTemplatesComponent);
    expect(fixture.componentInstance.isCustomTemplates).toBeTruthy();
  });

  it('should get back the filtered templates', () => {
    path.path = 'search';
    fixture = TestBed.createComponent(BrowseTemplatesComponent);
    expect(fixture.componentInstance.templates).toBe(filterTemplates);
  });

  it('should have isCustomTemplates flag set to false when the path is search', () => {
    path.path = 'search';
    fixture = TestBed.createComponent(BrowseTemplatesComponent);
    expect(fixture.componentInstance.isCustomTemplates).toBeFalsy();
  });

  it('should get back the category templates', () => {
    path.path = 'category';
    fixture = TestBed.createComponent(BrowseTemplatesComponent);
    expect(fixture.componentInstance.templates).toBe(categoryTemplates);
  });

  it('should have isCustomTemplates flag set to false when the path is a category', () => {
    path.path = 'category';
    fixture = TestBed.createComponent(BrowseTemplatesComponent);
    expect(fixture.componentInstance.isCustomTemplates).toBeFalsy();
  });

  it('should render skeleton when loading templates is set to true', () => {
    component.loadingTemplates = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-skeleton-text'))).toBeTruthy();
  });

  it('should not render skeleton when loading templates is set to false', () => {
    component.loadingTemplates = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-skeleton-text'))).toBeNull();
  });

  it('should render heading highlight when there is a highlight', () => {
    component.headingHighlight = 'Highlight';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('span.filter'))).toBeTruthy();
  });

  it('should not render heading highlight when there is not a highlight', () => {
    component.headingHighlight = '';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('span.filter'))).toBeNull();
  });

  it('should render empty results when there are no templates', () => {
    component.templates = [];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-empty-results'))).toBeTruthy();
  });

  it('should not render empty results when there are templates', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-empty-results'))).toBeNull();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
