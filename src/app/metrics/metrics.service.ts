import { Injectable } from '@angular/core';
import { ApolloService } from '@app/shared/apollo/apollo.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

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
      map(response => {
        console.log('response::', response);
      })
    );
  }
}
