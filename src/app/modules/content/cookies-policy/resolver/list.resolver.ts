import { Injectable } from "@angular/core";

import { ContentService } from "@app/services/content/content.service";
import { StylePagination } from "@app/services/styles/styles.type";

import { Observable, forkJoin, map } from "rxjs";

export interface ListResolverType {
  d1?: StylePagination;
  d2?: StylePagination;
}

@Injectable({
  providedIn: "root",
})
export class ListResolver {
  constructor(private _contentService: ContentService) {}

  resolve(): Observable<ListResolverType> {
    return forkJoin([this._contentService.getCookiesPolicy()]).pipe(
      map(value => {
        return {
          navigators: value[0],
        } as ListResolverType;
      })
    );
  }
}
