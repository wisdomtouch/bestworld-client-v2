import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { AdsVideoService } from "@services/adsvideos/ads-videos.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdsVideoEditResolver {
  constructor(private _adsVideoService: AdsVideoService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._adsVideoService.getById(id ?? "")]);
  }
}
