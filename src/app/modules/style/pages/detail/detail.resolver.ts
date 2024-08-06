import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { StylesService } from "@services/styles/styles.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DetailResolver {
  constructor(private _stylesService: StylesService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._stylesService.getByIdStyle(id)]);
  }
}
