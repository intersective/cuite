import { Injectable } from '@angular/core';
import { ApolloService } from '@app/shared/apollo/apollo.service';
import { map, Observable } from 'rxjs';

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
  saveMetric(value: any): Observable<any> {
    throw new Error('Method not implemented.');
  }

  constructor(
    private graphql: ApolloService,
  ) { }

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
