import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { BannerService } from "@services/banners/banners.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EditResolver {
  constructor(private _bannerService: BannerService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._bannerService.getByIdBanner(id ?? "")]);
  }
}
