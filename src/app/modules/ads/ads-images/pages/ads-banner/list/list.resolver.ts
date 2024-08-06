import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { AdsImagesService } from "@app/services/adsimages/ads-images.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdsBannerListResolver {
  constructor(private _adsImageService: AdsImagesService) {}
  resolve(route: ActivatedRouteSnapshot) {
    let page = route.paramMap.get("page");
    let position = route.paramMap.get("position");
    if (page == null || position == null) {
      (page = "home"), (position = "home-banner");
    }
    return forkJoin([this._adsImageService.getListHomeBanner(page, position)]);
  }
}
