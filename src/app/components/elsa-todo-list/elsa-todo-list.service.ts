import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { delay } from 'rxjs';
import { RequestService } from '@shared/request/request.service';
import { environment } from '@environments/environment';
import { DemoService } from '@services/demo.service';
import { UtilsService } from '@services/utils.service';

/**
 * list of api endpoint involved in this service
 */
const api = {
  get: {
    todoItem: 'api/v2/motivations/todo_item/list.json',
  }
};

export interface TodoItem {
  id: number;
  name: string;
  identifier: string;
  isDone: boolean;
  meta: {
    count: number;
    action: string;
    actionTitle: string;
    actionTarget: string;
    users: any;
    isTeam: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ElsaTodoListService {

  constructor(
    private request: RequestService,
    private demo: DemoService,
    private utils: UtilsService
  ) { }

  getTodoItems() {
    if (environment.demo) {
      const response = this.demo.getTodoItems();
      return of(this._handleTodoItemResponse(response)).pipe(delay(1000));
    }
    return this.request.get(api.get.todoItem)
      .pipe(map(this._handleTodoItemResponse, this));
  }

  private _handleTodoItemResponse(response) {
    const todoItems: Array<TodoItem> = [];
    response.data.forEach(todoItem => {
      // change meta.users to array if it's not
      if (this.utils.has(todoItem, 'meta.users') && !Array.isArray(todoItem.meta.users)) {
        todoItem.meta.users = Object.values(todoItem.meta.users);
      }
      todoItems.push({
        id: todoItem.id,
        name: todoItem.name,
        isDone: todoItem.is_done,
        identifier: todoItem.identifier,
        meta: {
          count: todoItem.meta.count,
          action: todoItem.meta.action,
          actionTitle: todoItem.meta.action_title,
          actionTarget: this.utils.has(todoItem, 'meta.action_target') ? environment.Practera + todoItem.meta.action_target : null,
          isTeam: todoItem.meta.is_team,
          users: todoItem.meta.is_team ? todoItem.meta.teams.map(team => {
            return {
              user_id: team.team_id,
              user_name: team.team_name,
              action_taken: team.action_taken
            };
          }) : todoItem.meta.users,
        }
      });
    });
    return todoItems;
  }


}
