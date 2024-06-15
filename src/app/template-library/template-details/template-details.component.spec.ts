import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateDetailsComponent } from './template-details.component';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {TemplateLibraryService} from '../template-library.service';
import {PopupService} from '../../shared/popup/popup.service';
import {By} from '@angular/platform-browser';
import {StorageService} from '../../shared/services/storage.service';
import {ToastController} from '@ionic/angular';

describe('TemplateDetailsComponent', () => {
  let component: TemplateDetailsComponent;
  let fixture: ComponentFixture<TemplateDetailsComponent>;
  const templateLibraryServiceSpy = jasmine.createSpyObj('TemplateLibraryService', ['getTemplate', 'importExperienceUrl', 'getCategories']);
  const popupServiceSpy = jasmine.createSpyObj('PopupService', ['showToast', 'showAlert', 'showLoading', 'dismissLoading']);
  const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getUser']);
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const toastSpy = jasmine.createSpyObj('ToastController', ['showToast']);

  const params = {
    templateId: 'abc123'
  };

  const publicTemplate = {
    uuid: '000f562e-0ed0-4afe-af53-7a8d20558ce1',
    name: 'Consulting Project Experience',
    description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
    leadImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2252&q=80',
    leadVideoUrl: 'https://cdn.videvo.net/videvo_files/video/free/2013-08/small_watermarked/hd0992_preview.webm',
    type: 'work simulation',
    attributes: ['teambased projects', '12-weeks', 'feedback loops'],
    designMapUrl: '/assets/icon/favicon.png',
    operationsManualUrl: '/assets/icon/logo.svg',
    isPublic: true
  };

  const categories = [
    {
      'leadImage': '/assets/template-library/teamProjects.png',
      'name': 'Team Projects',
      'id': 'Team Project',
      'description': 'Create teams of learners who complete a project with multiple feedback loops from industry experts\n' +
        'Use and edit our pre-loaded content with step by step instructions used by more than 10,000 students. Team-based project require a client brief and someone to provide feedback for each learner team (If you don’t have projects for your learners, send us a note!)',
      'color': 'rgba(0,64,229, 0.7)',
      'isLarge': true
    },
    {
      'leadImage': '/assets/template-library/internship.png',
      'name': 'Internships',
      'id': 'Internship',
      'description': 'Monitor and quality assure your (virtual) internship program at scale with our fully editable content with step by step instructions used by more than 10,000 students. Use our step by step instructions for both intern and supervisor to engage in regular feedback, reflection and planning loops. Internships require a placement and supervisor to provide feedback for each learner.',
      'color': 'rgba(85, 2, 136, 0.7)',
      'isLarge': true
    },
    {
      'leadImage': '/assets/template-library/simulation.png',
      'name': 'Work Simulations',
      'id': 'Work Simulation',
      'description': 'Scaling authentic work-integrated learning experiences is hard - but did you know that you can simulate real world tasks in an authentic way that gives students an insight into their potential future job? We have created a range of realistic and authentic work simulation experiences that students love!',
      'color': 'rgba(229, 69, 0, 0.7)',
      'isLarge': true
    },
    {
      'leadImage': '/assets/template-library/mentoring.png',
      'name': 'Mentoring',
      'id': 'Mentoring',
      'description': 'Support mentees and mentors engage in a structured mentoring relationship. Our fully editable pre-loaded content comes with step by step instructions for both mentor and mentee to engage in regular feedback, reflection and planning loops. Mentoring experiences require pairs or groups of mentors and mentees.',
      'color': 'rgba(221, 0, 59, 0.7)',
      'isLarge': false
    },
    {
      'leadImage': '/assets/template-library/accelerators.png',
      'name': 'Accelerators',
      'id': 'Accelerator',
      'description': 'Run your accelerator program effectively and efficiently with our editable pre-loaded content with step by step instructions. Support teams of learners go through an innovation process with multiple feedback loops and manage quality assurance for your cohort to guarantee success.',
      'color': 'rgba(37, 105, 120, 0.7)',
      'isLarge': false
    },
    {
      'leadImage': '/assets/template-library/skillsPortfolio.png',
      'name': 'Skills Portfolios',
      'id': 'Skills Portfolio',
      'description': 'With our Skills Portfolio experiences, you can support learners to build portfolios of their real world learning experiences and achievements against competency frameworks. You can use any competency framework and drive skill development tracking with reflective learning and feedback loops.',
      'color': 'rgba(9, 129, 7, 0.7)',
      'isLarge': false
    },
    {
      'leadImage': '/assets/template-library/other.jpg',
      'name': 'Others',
      'id': 'Other',
      'description': 'Practera supports any type of experiential learning. Below are some examples of other experiences our customers have used in the past.',
      'color': 'rgba(69, 40, 48, 0.7)',
      'isLarge': false
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDetailsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of(params),
          },
        },
        {
          provide: TemplateLibraryService,
          useValue: templateLibraryServiceSpy
        },
        {
          provide: PopupService,
          useValue: popupServiceSpy
        },
        {
          provide: StorageService,
          useValue: storageServiceSpy
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
        {
          provide: ToastController,
          useValue: toastSpy,
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDetailsComponent);
    component = fixture.componentInstance;
    templateLibraryServiceSpy.getTemplate = jasmine.createSpy().and.returnValue(of(publicTemplate));
    templateLibraryServiceSpy.importExperienceUrl = jasmine.createSpy().and.returnValue(of({experienceUuid: 'abc123'}));
    templateLibraryServiceSpy.getCategories = jasmine.createSpy().and.returnValue(categories);
    storageServiceSpy.getUser = jasmine.createSpy().and.returnValue(of({role: 'inst_admin'}));
    popupServiceSpy.showToast = jasmine.createSpy().and.returnValue({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton when it is loading the template', () => {
    component.loadingTemplate = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-skeleton-text'))).toBeTruthy();
  });

  it('should not render skeleton when it is not loading the template', () => {
    component.loadingTemplate = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-skeleton-text'))).toBeNull();
  });

  it('should render template name', () => {
    component.loadingTemplate = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.template-title')).nativeElement.innerText).toEqual(publicTemplate.name);
  });

  it('should call import experience', () => {
    templateLibraryServiceSpy.importExperienceUrl = jasmine.createSpy().and.returnValue(of({experienceUuid: null}));
    component.importTemplate('abc123');
    expect(templateLibraryServiceSpy.importExperienceUrl).toHaveBeenCalledWith('abc123');
    expect(popupServiceSpy.showToast).toHaveBeenCalledWith('Failed to create the experience!');
  });

  it('should render custom template chip when the template is not public', () => {
    component.loadingTemplate = false;
    fixture.detectChanges();
    component.template.isPublic = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-custom-template-chip'))).toBeTruthy();
  });

  it('should not render custom template chip when the template is public', () => {
    component.loadingTemplate = false;
    fixture.detectChanges();
    component.template.isPublic = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-custom-template-chip'))).toBeNull();
  });

  it('should call the confirm popup', () => {
    component.deleteTemplate();
    expect(popupServiceSpy.showAlert).toHaveBeenCalled();
  });

  it('canDelete() should allow admin to delete a private template', () => {
    storageServiceSpy.getUser = jasmine.createSpy().and.returnValue({role: 'inst_admin'});
    component.template = publicTemplate;
    component.template.isPublic = false;
    fixture.detectChanges();
    expect(component.canDelete()).toEqual(true);
  });

  it('canDelete() should not allow admin to delete a public template', () => {
    storageServiceSpy.getUser = jasmine.createSpy().and.returnValue({role: 'inst_admin'});
    component.template = publicTemplate;
    component.template.isPublic = true;
    fixture.detectChanges();
    expect(component.canDelete()).toEqual(false);
  });

  it('canDelete() should not allow a non-admin to delete a private template', () => {
    storageServiceSpy.getUser = jasmine.createSpy().and.returnValue({role: 'author'});
    component.template = publicTemplate;
    component.template.isPublic = false;
    fixture.detectChanges();
    expect(component.canDelete()).toEqual(false);
  });

  it('canDelete() should return false when myInfo is undefined', () => {
    storageServiceSpy.getUser = jasmine.createSpy().and.returnValue(undefined);
    component.template = publicTemplate;
    component.template.isPublic = false;
    fixture.detectChanges();
    expect(component.canDelete()).toEqual(false);
  });

  it('Calling confirmed call delete template in the template service', () => {
    templateLibraryServiceSpy.deleteTemplate = jasmine.createSpy().and.returnValue(of({success: true, message: 'message'}));
    component.deleteTemplateConfirm();
    expect(templateLibraryServiceSpy.deleteTemplate).toHaveBeenCalledWith(publicTemplate.uuid);
  });

  it('A successful delete should navigate back to the templates and create a toast', () => {
    templateLibraryServiceSpy.deleteTemplate = jasmine.createSpy().and.returnValue(of({success: true, message: 'message'}));
    component.template = publicTemplate;
    fixture.detectChanges();
    component.deleteTemplateConfirm();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/templates']);
    expect(popupServiceSpy.showToast).toHaveBeenCalled();
  });

  it('A unsuccessful delete create a toast', () => {
    templateLibraryServiceSpy.deleteTemplate = jasmine.createSpy().and.returnValue(of({success: false, message: 'message'}));
    component.template = publicTemplate;
    fixture.detectChanges();
    component.deleteTemplateConfirm();
    expect(popupServiceSpy.showToast).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
  });

});
