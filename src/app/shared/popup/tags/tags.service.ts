import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DemoService } from '@services/demo.service';
import { UtilsService } from '@services/utils.service';
import { RequestService } from '@shared/request/request.service';
import { map } from 'rxjs/operators';
import { ApolloService } from '@shared/apollo/apollo.service';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(
    private demo: DemoService,
    private utils: UtilsService,
    private service: RequestService,
    private apollo: ApolloService,
  ) {}

  getTagsBy(term: string) {
    if (environment.demo) {
      return this.demo.getTags().pipe(map(this._handleTags));
    }
    return this.apollo.graphQLFetch(
      `query tags($type: String!, $filter: String) {
        tags(type: $type, filter: $filter) {
          name
        }
      }`,
      {
        type: 'Experience',
        filter: term
      }
    ).pipe(map(this._handleTags));
  }

  private _handleTags(res) {
    if (!res.data) {
      return [];
    }
    return res.data.tags.map(t => t.name);
  }

  updateExperienceTags(experience, tags: string[]) {
    if (environment.demo) {
      return this.demo.updateExperienceTags(experience, tags).pipe(map(res => {
        this.utils.broadcastEvent('exp-tags-updated', { experience, tags });
        return res;
      }));
    }
    return this.apollo.graphQLMutate(
      `mutation updateTags($model: String!, $modelUuid: String, $tags: [String]) {
        updateTags(model: $model, modelUuid: $modelUuid, tags: $tags) {
          success
        }
      }`,
      {
        model: 'Experience',
        modelUuid: experience.uuid,
        tags
      }
    ).pipe(map(res => {
      this.utils.broadcastEvent('exp-tags-updated', { experience, tags });
      return res;
    }));
  }

}
