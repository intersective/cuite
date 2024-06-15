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
    messageTemplate: 'api/v2/motivations/todo_item/message_template.json'
  },
  post: {
    act: 'api/v2/motivations/todo_item/act.json'
  }
};

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private request: RequestService,
    private demo: DemoService
  ) { }

  getMessageTemplates(identifier) {
    if (environment.demo) {
      const response = this.demo.getMessageTemplates(identifier);
      return of(this._handleMessageTemplatesResponse(response)).pipe(delay(1000));
    }
    return this.request.get(api.get.messageTemplate, {params: {
      identifier: identifier
    }})
      .pipe(map(this._handleMessageTemplatesResponse));
  }

  private _handleMessageTemplatesResponse(response) {
    return response.data;
  }

  sendMessage(data) {
    if (environment.demo) {
      console.log(data);
      return of(true).pipe(delay(1000));
    }
    return this.request.post(api.post.act, {
      id: data.id,
      entities: data.entities,
      to_team: data.toTeam,
      type: 'message',
      sms: data.sms,
      email: data.email
    });
  }

}
