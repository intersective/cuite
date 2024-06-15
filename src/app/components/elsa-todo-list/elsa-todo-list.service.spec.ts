import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { of, async } from 'rxjs';
import { RequestService } from '@shared/request/request.service';
import { DemoService } from '@services/demo.service';
import { UtilsService } from '@services/utils.service';
import { environment } from '@environments/environment';

import { ElsaTodoListService } from './elsa-todo-list.service';

describe('ElsaTodoListService', () => {
  let service: ElsaTodoListService;
  let requestServiceSpy: jasmine.SpyObj<RequestService>;
  let demoServiceSpy: jasmine.SpyObj<DemoService>;
  let utilSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ElsaTodoListService,
        {
          provide: RequestService,
          useValue: jasmine.createSpyObj('RequestService', ['get'])
        },
        {
          provide: DemoService,
          useValue: jasmine.createSpyObj('DemoService', ['getTodoItems'])
        },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj('UtilsService', ['has'])
        }
      ]
    });
    service = TestBed.inject(ElsaTodoListService);
    requestServiceSpy = TestBed.inject(RequestService) as jasmine.SpyObj<RequestService>;
    demoServiceSpy = TestBed.inject(DemoService) as jasmine.SpyObj<DemoService>;
    utilSpy = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected todoItems', fakeAsync(() => {
    const todoItemsResponse = {
      data: [
        {
          id: 1,
          name: 'name',
          identifier: 'identifier',
          is_done: false,
          meta: {
            count: 2,
            action: 'message',
            action_title: 'remind students',
            is_team: false,
            users: [
              {
                user_id: 1,
                user_name: 'student name',
                user_email: 'user@practera.com',
                action_taken: false
              }
            ]
          }
        }
      ]
    };
    const expectedReturn = [
      {
        id: todoItemsResponse.data[0].id,
        name: todoItemsResponse.data[0].name,
        identifier: todoItemsResponse.data[0].identifier,
        isDone: todoItemsResponse.data[0].is_done,
        meta: {
          count: todoItemsResponse.data[0].meta.count,
          action: todoItemsResponse.data[0].meta.action,
          actionTitle: todoItemsResponse.data[0].meta.action_title,
          actionTarget: null,
          isTeam: todoItemsResponse.data[0].meta.is_team,
          users: todoItemsResponse.data[0].meta.users
        }
      }
    ];
    if (environment.demo) {
      let todoItemsRes;
      demoServiceSpy.getTodoItems.and.returnValue(todoItemsResponse);
      service.getTodoItems().subscribe((todoItems) => {
        todoItemsRes = todoItems;
      });
      tick(1000);
      expect(todoItemsRes).toEqual(expectedReturn);
      expect(demoServiceSpy.getTodoItems.calls.count()).toBe(1, 'one call');
    } else {
      let todoItemsRes;
      requestServiceSpy.get.and.returnValue(of(todoItemsResponse));
      service.getTodoItems().subscribe((todoItems) => {
        todoItemsRes = todoItems;
      });
      tick(1000);
      expect(todoItemsRes).toEqual(expectedReturn, 'expected todoItems');
      expect(requestServiceSpy.get.calls.count()).toBe(1, 'one call');
    }
  }));

});
