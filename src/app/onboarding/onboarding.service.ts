import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { DemoService } from '@services/demo.service';
import { RequestService } from '../shared/request/request.service';
import { Observable } from 'rxjs/Observable';
import { urlFormatter } from 'helper';
import { StorageService } from '@app/shared/services/storage.service';

export interface Template {
  uuid: string;
  name: string;
  abstract: string;
  leadImageUrl: string;
  description?: string;
  level?: string;
  time?: string;
  projects?: [{
    duration: string;
    activities: [{
      name: string;
      tasks: [{
        name: string;
        type: string;
      }]
    }],
    briefsCount?: number;
  }];
}

export interface Brief {
  uuid: string;
  name: string;
  industry: string;
  abstract: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(
    private request: RequestService,
    private demo: DemoService,
    private storage: StorageService
  ) { }

  getTemplates(attribute: string): Observable<[Template]> {
    // we don't need the apikey to query for templates
    if (this.storage.getUser().apikey) {
      this.storage.setUser({ apikey: null });
    }
    if (environment.demo) {
      return this.demo.getOnboardingTemplates().pipe(map(this._handleOnBoardingTemplates));
    }
    return this.request.graphQLQuery(
      `query onboardingTemplates($attribute: String) {
        onboardingTemplates(attribute: $attribute) {
          uuid
          name
          abstract
          leadImageUrl
        }
      }`,
      { attribute },
      {
        noCache: true
      }
    ).pipe(map(this._handleOnBoardingTemplates));
  }

  private _handleOnBoardingTemplates(res) {
    if (!res || !res.data || !res.data.onboardingTemplates) {
      return [];
    }
    return res.data.onboardingTemplates;
  }

  getTemplateDetail(params: { uuid?: string, type?: string }): Observable<Template> {
    if (environment.demo) {
      return this.demo.getOnboardingTemplateDetail(params.type).pipe(map(this._handleOnBoardingTemplate));
    }
    return this.request.graphQLQuery(
      `query onboardingTemplate($uuid: ID, $type: String) {
        onboardingTemplate(uuid: $uuid, type: $type) {
          uuid
          name
          description
          level
          time
          projects {
            duration
            briefsCount
            activities {
              name
              tasks {
                name
                type
              }
            }
          }
        }
      }`,
      params
    ).pipe(map(this._handleOnBoardingTemplate));
  }

  private _handleOnBoardingTemplate(res) {
    if (!res || !res.data || !res.data.onboardingTemplate) {
      return null;
    }
    return res.data.onboardingTemplate;
  }

  getBriefs(templateUuid: string, duration: string): Observable<[Brief]> {
    if (environment.demo) {
      return this.demo.getOnboardingBriefs().pipe(map(this._handleBriefs));
    }
    return this.request.graphQLQuery(
      `query onboardingBriefs($templateUuid: ID!, $duration: String!) {
        onboardingBriefs(templateUuid: $templateUuid, duration: $duration) {
          uuid
          industry
          name
          abstract
          description
          logoUrl
          websiteUrl
        }
      }`,
      {
        templateUuid,
        duration
      }
    ).pipe(map(this._handleBriefs));
  }

  private _handleBriefs(res) {
    if (!res || !res.data || !res.data.onboardingBriefs) {
      return [];
    }
    return res.data.onboardingBriefs;
  }
}
