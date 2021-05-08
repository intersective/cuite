import { TestBed } from '@angular/core/testing';

import { TemplateLibraryService } from './template-library.service';
import { RequestService } from '@shared/request/request.service';
import { DemoService } from '@services/demo.service';
import { environment } from '@environments/environment';
import {of} from 'rxjs';

describe('TemplateLibraryService', () => {
  let service: TemplateLibraryService;
  const demoService = jasmine.createSpyObj('DemoService', ['getTemplates', 'getTemplate']);
  const requestService = jasmine.createSpyObj('RequestService', ['graphQLQuery']);

  const dummyTemplate = {
    name: 'exp',
    uuid: 'abc123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TemplateLibraryService,
        {
          provide: RequestService,
          useValue: requestService
        },
        {
          provide: DemoService,
          useValue: demoService
        },
      ]
    });
    service = TestBed.inject(TemplateLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('for getTemplates', () => {
    it('demo response', () => {
      environment.demo = true;
      demoService.getTemplates = jasmine.createSpy().and.returnValue(of({}));
      service.getTemplates().subscribe(res => expect(res).toEqual([]));
    });
    it('graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of({
        data: {
          templates: [dummyTemplate]
        }
      }));
      service.getTemplates().subscribe(res => expect(res).toEqual([dummyTemplate]));
    });
    it('handles undefined graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of(undefined));
      service.getTemplates().subscribe(res => expect(res).toEqual([]));
    });
    it('handles undefined data from graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of({data: undefined}));
      service.getTemplates().subscribe(res => expect(res).toEqual([]));
    });
  });

  describe('for getTemplatesByCategory', () => {
    it('demo response', () => {
      environment.demo = true;
      demoService.getTemplates = jasmine.createSpy().and.returnValue(of({}));
      service.getTemplatesByCategory('category').subscribe(res => expect(res).toEqual([]));
    });
    it('graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of({
        data: {
          templates: [dummyTemplate]
        }
      }));
      service.getTemplatesByCategory('category').subscribe(res => expect(res).toEqual([dummyTemplate]));
    });
    it('handles undefined graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of(undefined));
      service.getTemplatesByCategory('category').subscribe(res => expect(res).toEqual([]));
    });
    it('handles undefined data from graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of({data: undefined}));
      service.getTemplatesByCategory('category').subscribe(res => expect(res).toEqual([]));
    });
  });

  describe('for getTemplatesByFilter', () => {
    it('demo response', () => {
      environment.demo = true;
      demoService.getTemplates = jasmine.createSpy().and.returnValue(of({}));
      service.getTemplatesByFilter('filter').subscribe(res => expect(res).toEqual([]));
    });
    it('graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of({
        data: {
          templates: [dummyTemplate]
        }
      }));
      service.getTemplatesByFilter('filter').subscribe(res => expect(res).toEqual([dummyTemplate]));
    });
    it('handles undefined graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of(undefined));
      service.getTemplatesByFilter('filter').subscribe(res => expect(res).toEqual([]));
    });
    it('handles undefined data from graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of({data: undefined}));
      service.getTemplatesByFilter('filter').subscribe(res => expect(res).toEqual([]));
    });
  });

  describe('for getTemplate', () => {
    it('demo response', () => {
      environment.demo = true;
      demoService.getTemplate = jasmine.createSpy().and.returnValue(of({}));
      // @ts-ignore
      service.getTemplate('abc123').subscribe(res => expect(res).toEqual({}));
    });
    it('graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of({
        data: {
          template: dummyTemplate
        }
      }));
      service.getTemplate('abc123').subscribe(res => expect(res).toEqual(dummyTemplate));
    });
    it('handles undefined graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of(undefined));
      // @ts-ignore
      service.getTemplate('abc123').subscribe(res => expect(res).toEqual({}));
    });
    it('handles undefined data from graphql response', () => {
      environment.demo = false;
      requestService.graphQLQuery = jasmine.createSpy().and.returnValue(of({data: undefined}));
      // @ts-ignore
      service.getTemplate('abc123').subscribe(res => expect(res).toEqual({}));
    });
  });

  describe('for getCategories', () => {
    it('gets the categories', () => {
      environment.demo = true;
      expect(service.getCategories()).toEqual([
        {
          'leadImage': '',
          'name': 'Team Projects',
          'type': 'team project',
          'color': 'rgba(0,64,229, 0.7)',
          'isLarge': true
        },
        {
          'leadImage': '',
          'name': 'Internships',
          'type': 'internship',
          'color': 'rgba(85, 2, 136, 0.7)',
          'isLarge': true
        },
        {
          'leadImage': '',
          'name': 'Simulations',
          'type': 'work simulation',
          'color': 'rgba(229, 69, 0, 0.7)',
          'isLarge': true
        },
        {
          'leadImage': '',
          'name': 'Mentoring',
          'type': 'mentoring',
          'color': 'rgba(221, 0, 59, 0.7)',
          'isLarge': false
        },
        {
          'leadImage': '',
          'name': 'Accelerators',
          'type': 'accelerator',
          'color': 'rgba(37, 105, 120, 0.7)',
          'isLarge': false
        },
        {
          'leadImage': '',
          'name': 'Skills Portfolios',
          'type': 'skill portfolio',
          'color': 'rgba(9, 129, 7, 0.7)',
          'isLarge': false
        },
        {
          'leadImage': '',
          'name': 'Others',
          'type': 'other',
          'color': 'rgba(69, 40, 48, 0.7)',
          'isLarge': false
        }
      ]);
    });
  });
});