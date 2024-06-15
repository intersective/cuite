import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ElsaTodoListComponent } from './elsa-todo-list.component';
import { ElsaTodoListService } from './elsa-todo-list.service';
import { Router } from '@angular/router';
import { StorageService } from '@services/storage.service';
import { of } from 'rxjs';

describe('ElsaTodoListComponent', () => {
  let component: ElsaTodoListComponent;
  let fixture: ComponentFixture<ElsaTodoListComponent>;
  let element: HTMLElement;
  let serviceSpy: jasmine.SpyObj<ElsaTodoListService>;

  beforeEach(waitForAsync(() => {
    let storageStub: Partial<StorageService>;
    let routerStub: Partial<Router>;
    TestBed.configureTestingModule({
      declarations: [ ElsaTodoListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ElsaTodoListService,
          useValue: jasmine.createSpyObj('ElsaTodoListService', ['getTodoItems'])
        },
        {
          provide: Router,
          useValue: routerStub
        },
        {
          provide: StorageService,
          useValue: storageStub
        }
      ]
    })
    .compileComponents();
    storageStub = TestBed.inject(StorageService) as Partial<StorageService>;
    routerStub = TestBed.inject(Router) as Partial<Router>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElsaTodoListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    serviceSpy = TestBed.inject(ElsaTodoListService) as jasmine.SpyObj<ElsaTodoListService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Issues" and elsa ghost when no todo items', () => {
    serviceSpy.getTodoItems.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component.loading).toEqual(false, 'loading finished');
    expect(component.rows.length).toEqual(0, '0 row of data');
    expect(serviceSpy.getTodoItems.calls.count()).toBe(1, 'one call');
    expect(element.querySelector('.title')).toBeTruthy();
    expect(element.querySelector('app-elsa-ghost')).toBeTruthy();
    expect(element.querySelector('.message-1')).toBeTruthy();
    expect(element.querySelector('.message-2')).toBeTruthy();
  });

  it('should update loading status and rows with getTodoItems()', () => {
    serviceSpy.getTodoItems.and.returnValue(of([
      {
        id: 1,
        name: 'test name',
        isDone: false,
        identifier: 'identifier',
        meta: {
          count: 1,
          action: 'message',
          actionTitle: 'test title',
          actionTarget: '/action',
          users: [],
          isTeam: false
        }
      }
    ]));
    fixture.detectChanges();
    expect(component.loading).toEqual(false, 'loading finished');
    expect(component.rows.length).toEqual(1, 'one row of data');
    expect(serviceSpy.getTodoItems.calls.count()).toBe(1, 'one call');
    // those should not be displayed
    expect(element.querySelector('.title')).toBeNull();
    expect(element.querySelector('app-elsa-ghost')).toBeNull();
    expect(element.querySelector('.message-1')).toBeNull();
    expect(element.querySelector('.message-2')).toBeNull();
    // datatable rendered
    expect(element.querySelector('ngx-datatable')).toBeTruthy();
  });
});
