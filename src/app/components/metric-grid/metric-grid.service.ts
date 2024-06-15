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
export class MetricGridService {

  constructor(
    private request: RequestService,
    private demo: DemoService
  ) { }

  getStatistics() {
    if (environment.demo) {
      const response = this.demo.getStatistics();
      return of(this._handleStatisticsResponse(response)).pipe(delay(1000));
    }
    return this.request.get(api.get.statistics, {params: {
      total_submissions: true,
      feedback_loops: true,
      helpfulness_rating: true
    }})
      .pipe(map(this._handleStatisticsResponse));
  }

  private _handleStatisticsResponse(response) {
    return {
      submissions: response.data.total_submissions ? response.data.total_submissions : 0,
      feedbackLoops: response.data.feedback_loops ? response.data.feedback_loops : 0,
      helpfulnessRating: response.data.helpfulness_rating ? response.data.helpfulness_rating : 'N/A'
    };
  }
}
