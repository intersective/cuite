import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { delay } from 'rxjs';
import { RequestService } from '@shared/request/request.service';
import { StorageService } from '@services/storage.service';
import { environment } from '@environments/environment';
import { DemoService } from '@services/demo.service';

const api = {
  jwt: 'jwt',
};

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private request: RequestService,
    private storage: StorageService,
    private demo: DemoService
  ) { }

  switchTimeline(timelineId): Observable<any> {
    if (environment.demo) {
      const response = this.demo.getJwt(timelineId);
      this._handleTimeline(response);
      return of(response).pipe(delay(2000));
    }
    return this.request.get(api.jwt, {params: {
      timeline_id: timelineId
    }}).pipe(map(this._handleTimeline, this));
  }

  private _handleTimeline(response) {
    if (response.data.apikey) {
      this.storage.setUser({
        apikey: response.data.apikey,
        timelineId: response.data.timeline_id,
        programId: response.data.program_id,
      });
    }
    return true;
  }
}

