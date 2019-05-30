import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestService } from '@shared/request/request.service';

/**
 * @name api
 * @description list of api endpoint involved in this service
 * @type {Object}
 */
const api = {
  get: {
    enrolments: 'enrolments',
  },
  post: {
  }
};

export interface Enrolment {
  name: string;
  userUid: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private request: RequestService,
  ) { }

  getEnrolments(offset = 0, limit = 10, sort = null) {
    const params = {
      offset: offset,
      limit: limit,
      role: 'participant',
      fields: 'name,user_uid',
      progress: true
    };
    if (sort && sort.progress) {
      params['sort'] = sort.progress === 'asc' ? 'progress' : '-progress';
    }
    return this.request.get(api.get.enrolments, {params: params})
    .pipe(map(response => {
      const enrolments: Array<Enrolment> = [];
      response.data.forEach(enrolment => {
        enrolments.push({
          name: enrolment.name,
          userUid: enrolment.user_uid
        });
      });
      return {
        data: enrolments,
        total: response.total
      };
    }));
  }
}
