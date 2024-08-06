import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { AdsImagesService } from "@services/adsimages/ads-images.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdsBannerDetailResolver {
  constructor(private _adsImageService: AdsImagesService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([
      this._adsImageService.getById(id),
      this._adsImageService.getAdsImageDetailStatById(id),
    ]);
  }
}
