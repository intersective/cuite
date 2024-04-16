import { Injectable } from '@angular/core';
import { ApolloService } from '@app/shared/apollo/apollo.service';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';

export interface Metric {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  aggregation: string;
  requirement: string;
  status: string;
  filterType: string;
  filterValue: string;
  dataSource: string;
  dataSourceId: null | number; // Assuming dataSourceId can be a number or null
  __typename: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private _metrics$: BehaviorSubject<Metric[]> = new BehaviorSubject<Metric[]>([]);
  metrics$ = this._metrics$.pipe(shareReplay(1));

  constructor(
    private graphql: ApolloService,
  ) { }

  getAssessments(): Observable<any> {
    return this.graphql.graphQLFetch(
      `query getAssessments {
        assessments {
          name
          question {
            id
            name
          }
        }
      }`
    ).pipe(
      map(response => response.data.assessments)
    );
  }

  createMetric(variables: {
    name: string;
    description: string;
    isPublic: boolean;
    aggregation: string;
    requirement: string;
    filterType: string;
    filterValue: string;
  }): Observable<any> {
    const paramsFormat = '$name: String!, $description: String, $isPublic: Boolean!, $aggregation: MetricAggregation, $requirement: MetricRequirement, $filterType: MetricFilterType, $filterValue: MetricFilterValue';
    const params = 'name:$name, description:$description, isPublic:$isPublic, aggregation:$aggregation, requirement:$requirement, filterType:$filterType, filterValue:$filterValue';

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
    filterType: string;
    filterValue: string;
  }): Observable<any> {
    const paramsFormat = '$uuid: ID!, $name: String, $description: String, $isPublic: Boolean, $aggregation: MetricAggregation, $requirement: MetricRequirement, $filterType: MetricFilterType, $filterValue: MetricFilterValue';
    const params = 'uuid:$uuid, name:$name, description:$description, isPublic:$isPublic, aggregation:$aggregation, requirement:$requirement, filterType:$filterType, filterValue:$filterValue';

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
          filterType
          filterValue
          dataSource
          dataSourceId
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
}
