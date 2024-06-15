import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import {TemplateLibraryComponent} from './template-library.component';
import {TemplateLibraryService} from './template-library.service';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowseTemplatesComponent} from './browse-templates/browse-templates.component';
import {Location} from '@angular/common';
import {HomeComponent} from '../home/home.component';

describe('TemplateLibraryComponent', () => {
  let component: TemplateLibraryComponent;
  let fixture: ComponentFixture<TemplateLibraryComponent>;
  const templateLibraryServiceSpy = jasmine.createSpyObj('TemplateLibraryService', ['getCategories']);
  let location: Location;

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
      imports: [RouterTestingModule.withRoutes([
          { path: 'templates/search/:filter', component: BrowseTemplatesComponent },
          { path: 'templates', component: HomeComponent },
        ])
      ],
      declarations: [ TemplateLibraryComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: TemplateLibraryService,
          useValue: templateLibraryServiceSpy
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateLibraryComponent);
    component = fixture.componentInstance;
    templateLibraryServiceSpy.getCategories = jasmine.createSpy().and.returnValue(categories);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should encode uri values correctly', () => {
    const value = 'This is a value with spaces $ & !';
    expect(component.encodeURI(value)).toEqual(encodeURI(value));
  });

  it('should update the route when the search is invoked', fakeAsync(() => {
    fixture.ngZone.run(() => {
      // @ts-ignore
      component.onSearch({
        detail: {
          value: 'filterValue'
        }
      });
      tick();
      location = TestBed.inject(Location);
      expect(location.path()).toEqual('/templates/search/filterValue');
    });
  }));

  it('should route to home when the search value is empty', fakeAsync(() => {
    fixture.ngZone.run(() => {
      // @ts-ignore
      component.onSearch({
        detail: {
          value: ''
        }
      });
      tick();
      location = TestBed.inject(Location);
      expect(location.path()).toEqual('/templates');
    });
  }));

  afterEach(() => {
    fixture.destroy();
  });
});
