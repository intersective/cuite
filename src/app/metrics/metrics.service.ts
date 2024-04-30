import { Injectable } from '@angular/core';
import { ApolloService } from '@app/shared/apollo/apollo.service';
import { BehaviorSubject, first, map, Observable, shareReplay, tap } from 'rxjs';

/**
 * @link https://intersective.github.io/core-graphql-api/metricaggregation.doc.html
 */
export enum MetricAggregation {
  count = 'count',
  sum = 'sum',
  average = 'average',
};

/**
 * @link https://intersective.github.io/core-graphql-api/metricrequirement.doc.html
 */
export enum MetricRequirement {
  required = 'required',
  recommended = 'recommended',
  not_required = 'not_required',
};

/**
 * @link https://intersective.github.io/core-graphql-api/metricstatus.doc.html
 */
export enum MetricStatus {
  draft = 'draft',
  active = 'active',
  archived = 'archived',
};

// @link https://intersective.github.io/core-graphql-api/metricfilterrole.doc.html
export enum MetricFilterRole {
  participant = 'participant',
  mentor = 'mentor',
  coordinator = 'coordinator',
  admin = 'admin',
};

/**
 * @link https://intersective.github.io/core-graphql-api/metricfilterstatus.doc.html
 */
export enum MetricFilterStatus {
  active = 'active',
  dropped = 'dropped',
};

export interface MetricAssessment {
  id: number;
  name: string;
  questions: {
    id: number;
    name: string;
    type: string;
  }[];
};

export interface Metric {
  id: number;
  uuid: string;
  name: string;
  description: string;
  isPublic: boolean;
  aggregation: string;
  requirement: string;
  status: string;
  filterRole: string[];
  filterStatus: string[];
  dataSource: string;
  dataSourceId: null | number; // Assuming dataSourceId can be a number or null
  assessment: {
    id: number,
    name: string,
    question: {
      id: number,
      name: string
    }
  }
  lastRecord: {
    value: number,
    count: number,
    created: string
  }
  __typename: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private _metrics$: BehaviorSubject<Metric[]> = new BehaviorSubject([]);
  metrics$ = this._metrics$.pipe(shareReplay(1));
  
  private _assessments$: BehaviorSubject<MetricAssessment[]> = new BehaviorSubject([]);
  assessments$ = this._assessments$.pipe(shareReplay(1));

  constructor(
    private graphql: ApolloService,
  ) { }

  getAssessments(): Observable<any> {
    return this.graphql.graphQLFetch(
      `query getAssessments($type: AssessmentQuestionType) {
        assessments {
          name
          questions(type: $type) {
            id
            type
            name
          }
        }
      }`,
      {
        variables: {
          type: 'oneof',
        }
      }
    ).pipe(
      map(response => response.data.assessments.filter(assessment =>
        assessment.questions.some(question => question.type === 'oneof')
      )),
      tap(assessments => this._assessments$.next(assessments)),
    );
  }

  createMetric(variables: {
    name: string;
    description: string;
    isPublic: boolean;
    aggregation: string;
    requirement: string;
    filterRole: string;
    filterStatus: string;
  }): Observable<any> {
    const paramsFormat = '$name: String!, $description: String, $isPublic: Boolean!, $aggregation: MetricAggregation, $requirement: MetricRequirement, $filterRole: [MetricFilterRole], $filterStatus: [MetricFilterStatus]';
    const params = 'name:$name, description:$description, isPublic:$isPublic, aggregation:$aggregation, requirement:$requirement, filterRole:$filterRole, filterStatus:$filterStatus';

    return this.graphql.graphQLMutate(
      `mutation createMetric(${paramsFormat}) {
        createMetric(${params}) {
          success
          message
        }
      }`,
      variables
    ).pipe(
      map(response => response.data)
    );
  }

  saveMetric(variables: {
    uuid: number;
    name: string;
    description: string;
    isPublic: boolean;
    aggregation: string;
    requirement: string;
    filterRole: string;
    filterStatus: string;
  }): Observable<any> {
    const paramsFormat = '$uuid: ID!, $name: String, $description: String, $isPublic: Boolean, $aggregation: MetricAggregation, $requirement: MetricRequirement, $status: MetricStatus, $filterRole: [MetricFilterRole], $filterStatus: [MetricFilterStatus]';
    const params = 'uuid:$uuid, name:$name, description:$description, isPublic:$isPublic, aggregation:$aggregation, requirement:$requirement, status:$status, filterRole:$filterRole, filterStatus:$filterStatus';

    return this.graphql.graphQLMutate(
      `mutation updateMetric(${paramsFormat}) {
        updateMetric(${params}) {
          success
          message
        }
      }`,
      variables
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * get metrics data
   * @param publicOnly boolean true: get metrics from library (template), false: don't get metrics from library (template)
   * @returns metrics data
   */
  getMetrics(publicOnly = false): any {
    return this.graphql.graphQLFetch(
      `query metrics($publicOnly: Boolean) {
        metrics(publicOnly: $publicOnly) {
          id
          uuid
          name
          description
          isPublic
          aggregation
          requirement
          status
          filterRole
          filterStatus
          dataSource
          dataSourceId
          assessment {
            id
            name
            question {
              id
              name
            }
          }
          lastRecord {
            value
            count
            created
          }
        }
      }`,
      {
        variables: {
          publicOnly
        }
      }
    ).pipe(
      map(response => response.data.metrics),
      tap(metrics => this._metrics$.next(metrics)),
    );
  }

  // utils
  color(tag: string): string {
    switch (tag) {
      // status
      case 'draft':
        return 'medium';
      case 'active':
        return 'success';
      case 'archived':
        return 'medium';

      // requirement
      case 'required':
        return 'danger';
      case 'recommended':
        return 'warning';
      case 'not_required':
        return 'medium';
    }
    return null;
  }

  useMetric(metric: Metric, requirement: 'required' | 'recommended' | 'not_required' = 'required') {
    return this.graphql.graphQLMutate(`
      mutation useMetric($uuid: ID!, $requirement: MetricRequirement) {
        useMetric(uuid: $uuid, requirement: $requirement) {
          success
          message
        }
      }`,
      {
        requirement,
        uuid: metric.uuid,
      }
    ).pipe(
      map(response => response.data),
    );
  }

  configure(uuid: string, questionId: number) {
    return this.graphql.graphQLMutate(`
      mutation configureMetric($uuid: ID!, $dataSourceId: Int) {
        configureMetric(uuid: $uuid, dataSourceId: $dataSourceId) {
          success
          message
        }
      }`,
      {
        uuid,
        dataSourceId: questionId,
      }
    ).pipe(
      map(response => response.data),
    );
  }

  calculate(uuids: string[]) {
    return this.graphql.graphQLMutate(`
      mutation calculateMetrics($uuids: [ID]) {
        calculateMetrics(uuids: $uuids) {
          success
          message
          data {
            uuid
            value
            count
          }
        }
      }`,
      {
        variables: {
          uuids,
        }
      }
    ).pipe(
      map(response => response.data),
    );
  }
}
