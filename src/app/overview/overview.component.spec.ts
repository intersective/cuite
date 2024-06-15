import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { SharedModule } from '@shared/shared.module';
import { OverviewComponent } from './overview.component';
import { OverviewService, Experience } from './overview.service';
import { UtilsService } from '@services/utils.service';
import { PopupService } from '@shared/popup/popup.service';
import * as XLSX from 'xlsx';
import { RouterTestingModule } from '@angular/router/testing';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  const overviewSpy = jasmine.createSpyObj('OverviewService', ['getExperiences', 'getExpsStatistics']);
  const utilsSpy = jasmine.createSpyObj('UtilsService', ['getEvent', 'has', 'isEqual']);
  const popupSpy = jasmine.createSpyObj('PopupService', ['showCreateExp']);

  const exps: Experience[] = [
    {
      uuid: '16c3d514-b459-b9d1-05c8-2bd1f582447c',
      name: 'XCELERY 2.0',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      type: 'internship',
      status: 'live',
      color: '',
      setupStep: 'visuals',
      role: 'admin',
      leadImage: '',
      todoItemCount: 1,
      tags: ['tag1', 'tag2', 'apple'],
      statistics: {
        enrolledUserCount: {
          admin: 4,
          coordinator: 3,
          mentor: 3,
          participant: 15
        },
        registeredUserCount: {
          admin: 4,
          coordinator: 3,
          mentor: 3,
          participant: 11
        },
        activeUserCount: {
          admin: 1,
          coordinator: 1,
          mentor: 2,
          participant: 8
        },
        feedbackLoopStarted: 300,
        feedbackLoopCompleted: 129,
        reviewRatingAvg: 0.83,
        onTrackRatio: 0.75,
        lastUpdated: 1612774050261
      }
    },
    {
      uuid: '16c3d514-b459-b9d1-05c8-2bd1f582447e',
      name: 'Teamnovation',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      type: 'team project',
      status: 'live',
      color: '',
      setupStep: 'visuals',
      role: 'admin',
      leadImage: '',
      todoItemCount: 2,
      tags: ['apple', 'banana', 'watermelon'],
      statistics: {
        enrolledUserCount: {
          admin: 4,
          coordinator: 3,
          mentor: 5,
          participant: 52
        },
        registeredUserCount: {
          admin: 4,
          coordinator: 3,
          mentor: 4,
          participant: 49
        },
        activeUserCount: {
          admin: 1,
          coordinator: 3,
          mentor: 3,
          participant: 22
        },
        feedbackLoopStarted: 49,
        feedbackLoopCompleted: 2,
        reviewRatingAvg: 0.6,
        onTrackRatio: 0.6,
        lastUpdated: 1612775394684
      }
    },
    {
      uuid: '16c3d514-b459-b9d1-05c8-2bd1f582447d',
      name: 'Teamnovation',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      type: 'team project',
      status: 'completed',
      color: '',
      setupStep: 'visuals',
      role: 'admin',
      leadImage: '',
      todoItemCount: 3,
      tags: ['apple', 'banana', 'watermelon'],
      statistics: {
        enrolledUserCount: {
          admin: 4,
          coordinator: 3,
          mentor: 5,
          participant: 53
        },
        registeredUserCount: {
          admin: 4,
          coordinator: 3,
          mentor: 5,
          participant: 50
        },
        activeUserCount: {
          admin: 1,
          coordinator: 3,
          mentor: 4,
          participant: 23
        },
        feedbackLoopStarted: 50,
        feedbackLoopCompleted: 3,
        reviewRatingAvg: 0.7,
        onTrackRatio: -1,
        lastUpdated: 1612775394683
      }
    },
    {
      uuid: '84f14db9-491a-09f7-ae61-9926f3ad8c8d',
      name: 'GROW 2020',
      description: `Practera is the leading platform to power high quality experiential learning programs.<br/><br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services<br/><br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services<br/><br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services<br/><br/>Deliver experiential learning programs at larger scale and lower cost<br/>Customisable platform to author, launch & manage programs<br/>Connect students to industry projects, internships & experiences<br/>Expert course design, configuration and deployment services`,
      type: 'team project',
      status: 'completed',
      role: 'mentor',
      setupStep: 'visuals',
      leadImage: '',
      color: '',
      todoItemCount: 0,
      tags: ['apple', 'watermelon'],
      statistics: {
        enrolledUserCount: {
          admin: 0,
          coordinator: 0,
          mentor: 1,
          participant: 21
        },
        registeredUserCount: {
          admin: 0,
          coordinator: 0,
          mentor: 1,
          participant: 21
        },
        activeUserCount: {
          admin: 0,
          coordinator: 0,
          mentor: 0,
          participant: 0
        },
        feedbackLoopStarted: 120,
        feedbackLoopCompleted: 56,
        reviewRatingAvg: 0.76,
        onTrackRatio: -1,
        lastUpdated: 1612493090322
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [ OverviewComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: OverviewService,
          useValue: overviewSpy
        },
        {
          provide: UtilsService,
          useValue: utilsSpy
        },
        {
          provide: PopupService,
          useValue: popupSpy
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    overviewSpy.getExperiences = jasmine.createSpy().and.returnValue(of(JSON.parse(JSON.stringify(exps))));
    overviewSpy.getExpsStatistics = jasmine.createSpy().and.returnValue(of(null));
    utilsSpy.getEvent = jasmine.createSpy().and.returnValue(of({}));
    utilsSpy.isEqual = jasmine.createSpy().and.callFake((value, other) => JSON.stringify(value) === JSON.stringify(other));
    utilsSpy.has = jasmine.createSpy().and.callFake((obj, key) => obj.hasOwnProperty(key));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('skeleton only', () => {
    component.skeletonOnly = true;
    fixture.detectChanges();
    expect(component.experiences).toEqual([]);
    expect(component.loadingExps).toEqual(true);
  });

  it('should get experiences data', () => {
    fixture.detectChanges();
    exps.splice(3, 1);
    expect(component.experiencesRaw).toEqual(exps);
    expect(component.experiences).toEqual(exps);
    expect(component.types).toEqual(['all', exps[1].type, exps[0].type]);
    expect(component.tags).toEqual([
      { name: 'tag1', count: 1, active: false },
      { name: 'tag2', count: 1, active: false },
      { name: 'apple', count: 3, active: false },
      { name: 'banana', count: 2, active: false },
      { name: 'watermelon', count: 2, active: false },
    ]);
    expect(component.loadingExps).toEqual(false);
  });

  it('should get experiences data. (after stats updated)', () => {
    overviewSpy.getExpsStatistics = jasmine.createSpy().and.returnValue(of([{
      uuid: exps[1].uuid,
      statistics: exps[0].statistics,
    }]));
    fixture.detectChanges();
    expect(component.experiencesRaw[1].statistics).toEqual(exps[0].statistics);
    expect(component.experiences[1].statistics).toEqual(exps[0].statistics);
    expect(component.types).toEqual(['all', exps[1].type, exps[0].type]);
    expect(component.tags).toEqual([
      { name: 'tag1', count: 1, active: false },
      { name: 'tag2', count: 1, active: false },
      { name: 'apple', count: 3, active: false },
      { name: 'banana', count: 2, active: false },
      { name: 'watermelon', count: 2, active: false },
    ]);
    expect(component.loadingExps).toEqual(false);
  });

  it('should get experiences data filtered by tag', () => {
    component.experiencesRaw = JSON.parse(JSON.stringify(exps));
    component.tags = [
      { name: 'tag1', count: 1, active: true },
      { name: 'tag2', count: 1, active: false },
      { name: 'apple', count: 2, active: false },
      { name: 'banana', count: 1, active: false },
      { name: 'watermelon', count: 1, active: false },
    ];
    component.filterAndOrder();
    expect(component.experiencesRaw).toEqual(exps);
    expect(component.experiences).toEqual([exps[0]]);
  });

  it('should get experiences data filtered by status', () => {
    component.experiencesRaw = JSON.parse(JSON.stringify(exps));
    component.status = exps[2].status;
    component.filterAndOrder();
    expect(component.experiencesRaw).toEqual(exps);
    expect(component.experiences).toEqual([exps[2]]);
  });

  it('should get experiences data filtered by type', () => {
    component.experiencesRaw = JSON.parse(JSON.stringify(exps));
    component.type = exps[0].type;
    component.filterAndOrder();
    expect(component.experiencesRaw).toEqual(exps);
    expect(component.experiences).toEqual([exps[0]]);
  });

  describe('should get experiences data sorted', () => {
    console.log(exps);
    let expsResult;
    beforeEach(() => {
      overviewSpy.getExpsStatistics = jasmine.createSpy().and.returnValue(of(null));
    });
    afterEach(() => {
      component.experiencesRaw = JSON.parse(JSON.stringify(exps));
      component.filterAndOrder();
      expect(component.experiencesRaw).toEqual(exps);
      expect(component.experiences).toEqual(expsResult);
    });
    it('by created time asc', () => {
      component.sortBy = component.sortList[0];
      component.sortDesc = false;
      expsResult = [exps[2], exps[1], exps[0]];
    });
    it('by user count desc', () => {
      component.sortBy = component.sortList[1];
      component.sortDesc = true;
      expsResult = [exps[2], exps[1], exps[0]];
    });
    it('by user count asc', () => {
      component.sortBy = component.sortList[1];
      component.sortDesc = false;
      expsResult = [exps[0], exps[1], exps[2]];
    });
    it('by recent active learners desc', () => {
      component.sortBy = component.sortList[2];
      component.sortDesc = true;
      expsResult = [exps[2], exps[1], exps[0]];
    });
    it('by recent active learners asc', () => {
      component.sortBy = component.sortList[2];
      component.sortDesc = false;
      expsResult = [exps[0], exps[1], exps[2]];
    });
    it('by recent active experts desc', () => {
      component.sortBy = component.sortList[3];
      component.sortDesc = true;
      expsResult = [exps[2], exps[1], exps[0]];
    });
    it('by recent active experts asc', () => {
      component.sortBy = component.sortList[3];
      component.sortDesc = false;
      expsResult = [exps[0], exps[1], exps[2]];
    });
    it('by feedback loops completed desc', () => {
      component.sortBy = component.sortList[4];
      component.sortDesc = true;
      expsResult = [exps[0], exps[2], exps[1]];
    });
    it('by feedback loops completed asc', () => {
      component.sortBy = component.sortList[4];
      component.sortDesc = false;
      expsResult = [exps[1], exps[2], exps[0]];
    });
    it('by on-track/off-track desc', () => {
      component.sortBy = component.sortList[5];
      component.sortDesc = true;
      expsResult = [exps[0], exps[1], exps[2]];
    });
    it('by on-track/off-track asc', () => {
      component.sortBy = component.sortList[5];
      component.sortDesc = false;
      expsResult = [exps[2], exps[1], exps[0]];
    });
    it('by feedback quality score desc', () => {
      component.sortBy = component.sortList[6];
      component.sortDesc = true;
      expsResult = [exps[0], exps[2], exps[1]];
    });
    it('by feedback quality score asc', () => {
      component.sortBy = component.sortList[6];
      component.sortDesc = false;
      expsResult = [exps[1], exps[2], exps[0]];
    });
    it('by todoItemCount desc', () => {
      component.sortBy = component.sortList[7];
      component.sortDesc = true;
      expsResult = [exps[2], exps[1], exps[0]];
    });
    it('by todoItemCount asc', () => {
      component.sortBy = component.sortList[7];
      component.sortDesc = false;
      expsResult = [exps[0], exps[1], exps[2]];
    });
  });

  it('handle events', () => {
    utilsSpy.getEvent = jasmine.createSpy().and.callFake(eventKey => {
      let eventData = {};
      switch (eventKey) {
        case 'exp-tags-updated':
          eventData = {
            experience: {
              uuid: exps[0].uuid
            },
            tags: ['tag1', 'tag3']
          };
          break;
      }
      return of(eventData);
    });
    fixture.detectChanges();
  });

  it('init with more than 7 exps', () => {
    overviewSpy.getExperiences = jasmine.createSpy().and.returnValue(of([...exps, ...exps, ...exps, ...exps]));
    fixture.detectChanges();
    expect(component.experiences.length).toEqual(7);
    expect(component.remainingExperiences.length).toEqual(5);
  });

  describe('load more', () => {
    it('remaining more than 7 exps', fakeAsync(() => {
      component.experiences = JSON.parse(JSON.stringify(exps));
      component.remainingExperiences = [...exps, ...exps, ...exps, ...exps];
      component.loadMore({ target: { complete: () => {} }});
      tick(600);
      expect(component.experiences.length).toEqual(10);
      expect(component.remainingExperiences.length).toEqual(5);
    }));
    it('remaining less than 7 exps', fakeAsync(() => {
      component.experiences = JSON.parse(JSON.stringify(exps));
      component.remainingExperiences = JSON.parse(JSON.stringify(exps));
      component.loadMore({ target: { complete: () => {} }});
      tick(600);
      expect(component.experiences.length).toEqual(6);
      expect(component.remainingExperiences.length).toEqual(0);
    }));
  });

  it('add popup', () => {
    component.add();
    expect(popupSpy.showCreateExp).toHaveBeenCalled();
  });

  it('create report', () => {
    component.tags = [
      { name: 'tag1', count: 1, active: false },
      { name: 'tag2', count: 1, active: false },
      { name: 'apple', count: 2, active: true },
      { name: 'banana', count: 1, active: false },
      { name: 'watermelon', count: 1, active: false },
    ];
    component.experiences = JSON.parse(JSON.stringify(exps));
    const writeFile = spyOn(XLSX, 'writeFile');
    component.createReport();
    expect(writeFile).toHaveBeenCalled();
  });
});
