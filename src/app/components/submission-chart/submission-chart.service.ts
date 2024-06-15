import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { delay } from 'rxjs';
import { RequestService } from '@shared/request/request.service';
import { environment } from '@environments/environment';
import { DemoService } from '@services/demo.service';

const api = {
  get: {
    statistics: 'statistics',
  }
};

@Injectable({
  providedIn: 'root'
})
export class SubmissionChartService {

  constructor(
    private request: RequestService,
    private demo: DemoService
  ) { }

  getSubmissions() {
    if (environment.demo) {
      const response = this.demo.getSubmissions();
      return of(this._handleSubmissionsResponse(response)).pipe(delay(1000));
    }
    return this.request.get(api.get.statistics, {params: {
      submissions: true
    }}).pipe(map(this._handleSubmissionsResponse));
  }

  private _handleSubmissionsResponse(response) {
    return response.data.submissions;
  }

}
