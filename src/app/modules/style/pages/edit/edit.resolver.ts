import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { NavigatorService } from "@services/navigators/navigators.service";
import { StylesService } from "@services/styles/styles.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EditResolver {
  constructor(
    private _stylesService: StylesService,
    private _navigatorService: NavigatorService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([
      this._stylesService.getByIdStyle(id ?? ""),
      this._navigatorService.getNavigator(),
    ]);
  }
}
