import { Injectable } from '@angular/core';
import { ApolloService } from '@app/shared/apollo/apollo.service';
import { map, Observable } from 'rxjs';

export interface Metric {
  id: number;
  uuid?: number;
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

  useMetric(uuid: number): Observable<any> {
    return this.graphql.graphQLMutate(
      `mutation useMetric($uuid: ID!) {
        useMetric(uuid: $uuid) {
          success
          message
        }
      }`,
      {
        uuid
      }
    ).pipe(
      map(response => response.data)
    );
  }

  deleteTemplate(uuid: number): Observable<any> {
    return this.graphql.graphQLMutate(
      `mutation deleteTemplate($uuid: ID!) {
        deleteTemplate(uuid: $uuid) {
          success
          message
        }
      }`,
      {
        uuid
      }
    ).pipe(
      map(response => response.data)
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
    const paramsFormat = '$name: String!, $description: String, $isPublic: Boolean!, $aggregation: String, $requirement: String, $filterType: String, $filterValue: String';
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
    const paramsFormat = '$uuid: ID!, $name: String, $description: String, $isPublic: Boolean, $aggregation: String, $requirement: String, $filterType: String, $filterValue: String';
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
  getMetrics(publicOnly): any {
    return this.graphql.graphQLFetch(
      `query metrics($publicOnly: Boolean) {
        metrics(publicOnly: $publicOnly) {
          id
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
      map(response => response.data.metrics)
    );
  }
}
