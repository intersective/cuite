import { Injectable } from '@angular/core';
import { RequestService } from '@shared/request/request.service';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { DemoService } from '@services/demo.service';
import { Observable } from 'rxjs';
import { ApolloService } from '@shared/apollo/apollo.service';

/**
 * list of api endpoint involved in this service
 */
const api = {
  post: {
    duplicate: 'api/v2/plan/experience/clone.json'
  }
};

export interface Experience {
  id?: number;
  uuid: string;
  timelineId?: number;
  name: string;
  description: string;
  type: string;
  status: string;
  color: string;
  leadImage: string;
  setupStep: string;
  tags: string[];
  todoItemCount: number;
  statistics: Statistics;
  role: Role;
  isLast?: boolean;
}

export type Role = 'sysadmin' | 'inst_admin' | 'admin' | 'coordinator' | 'mentor' | 'participant';

export interface Tag {
  name: string;
  active?: boolean;
  count?: number;
}

export interface Statistics {
  enrolledUserCount: UserCount;
  registeredUserCount: UserCount;
  activeUserCount: UserCount;
  feedbackLoopStarted: number;
  feedbackLoopCompleted: number;
  reviewRatingAvg: number;
  onTrackRatio: number;
  lastUpdated: number;
}

export interface UserCount {
  admin: number;
  coordinator: number;
  mentor: number;
  participant: number;
}

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  constructor(
    private request: RequestService,
    private demo: DemoService,
    private apollo: ApolloService,
  ) { }

  getExperiences() {
    if (environment.demo) {
      return this.demo.getExperiences().pipe(map(this._handleExperiences));
    }
    return this.apollo.graphQLFetch(
      `query experiences {
        experiences {
          id
          uuid
          timelineId
          name
          description
          type
          color
          leadImage
          status
          setupStep
          role
          isLast
          tags{
            name
          }
          todoItemCount
          statistics{
            enrolledUserCount {
              admin
              coordinator
              mentor
              participant
            }
            registeredUserCount{
              admin
              coordinator
              mentor
              participant
            }
            activeUserCount{
              admin
              coordinator
              mentor
              participant
            }
            feedbackLoopStarted
            feedbackLoopCompleted
            reviewRatingAvg
            onTrackRatio
            lastUpdated
          }
        }
      }`,
      {}
    ).pipe(map(this._handleExperiences));
  }

  private _handleExperiences(res) {
    if (!res.data) {
      return [];
    }
    return res.data.experiences.map(exp => {
      return {
        ...exp,
        ...{
          tags: exp.tags.map(t => t.name)
        }
      };
    });
  }

  getExpsStatistics(uuids: string[]) {
    if (environment.demo) {
      return this.demo.getExpsStatistics(uuids).pipe(map(this._handleExpsStatistics));
    }
    return this.apollo.graphQLFetch(
      `query expsStatistics($uuids: [ID]){
        expsStatistics(uuids: $uuids) {
          uuid
          statistics {
            enrolledUserCount {
              admin
              coordinator
              mentor
              participant
            }
            registeredUserCount{
              admin
              coordinator
              mentor
              participant
            }
            activeUserCount{
              admin
              coordinator
              mentor
              participant
            }
            feedbackLoopStarted
            feedbackLoopCompleted
            reviewRatingAvg
            onTrackRatio
            lastUpdated
          }
        }
      }`,
      {
        uuids
      }
    ).pipe(map(this._handleExpsStatistics));
  }

  private _handleExpsStatistics(res) {
    if (!res.data || !res.data.expsStatistics) {
      return null;
    }
    return res.data.expsStatistics;
  }

  deleteExperience(experience) {
    if (environment.demo) {
      return this.demo.deleteExperience(experience);
    }
    return this.apollo.graphQLMutate(
      `mutation deleteExperience($uuid: String!) {
        deleteExperience(uuid: $uuid) {
          success
          message
        }
      }`,
      {
        uuid: experience.uuid,
      }
    );
  }

  duplicateExperience(uuid, roles) {
    if (environment.demo) {
      return this.demo.duplicateExperience(uuid, roles);
    }
    return this.request.post(api.post.duplicate, {
      uuid: uuid,
      roles: roles,
    });
  }

  duplicateExperienceUrl(uuid: string, roles: string[]): Observable<string> {
    if (environment.demo) {
      return this.demo.duplicateExperienceUrl(uuid).pipe(map(this._handleDuplicateExperienceUrlResponse));
    }
    return this.apollo.graphQLFetch(
      `query duplicateExperienceUrl($uuid: ID!, $roles: [String]) {
        duplicateExperienceUrl(uuid: $uuid, roles: $roles)
      }`,
      { uuid, roles }
    ).pipe(map(this._handleDuplicateExperienceUrlResponse));
  }

  private _handleDuplicateExperienceUrlResponse(res): string {
    if (!res || !res.data) {
      return null;
    }
    return res.data.duplicateExperienceUrl;
  }

  updateExperience(experience, status: string) {
    if (environment.demo) {
      return this.demo.updateExperience(experience, status);
    }
    return this.apollo.graphQLMutate(
      `mutation updateExperience($uuid: String!, $status: String) {
        updateExperience(uuid: $uuid, status: $status) {
          success
          message
        }
      }`,
      {
        uuid: experience.uuid,
        status,
      }
    );
  }

  exportExperience(uuid: string, name: string) {
    if (environment.demo) {
      return this.demo.exportExperience(uuid, name).pipe(map(this._handleExportExperienceResponse));
    }
    return this.apollo.graphQLMutate(
      `mutation exportExperience($uuid: ID!, $name: String) {
        exportExperience(uuid: $uuid, name: $name) {
          success
          message
          uuid
        }
      }`,
      {
        uuid,
        name
      }
    ).pipe(map(this._handleExportExperienceResponse));
  }

  private _handleExportExperienceResponse(res): { uuid: string } {
    if (!res || !res.data) {
      return null;
    }
    return res.data.exportExperience;
  }

}
