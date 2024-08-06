import { Injectable } from "@angular/core";

import { StylesService } from "@services/styles/styles.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ListResolver {
  constructor(private _stylesService: StylesService) {}

  resolve() {
    return forkJoin([this._stylesService.getStyle()]);
  }
}
