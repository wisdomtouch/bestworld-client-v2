import { Injectable } from "@angular/core";

import { AdsVideoService } from "@app/services/adsvideos/ads-videos.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdsVideoListResolver {
  constructor(private _adsVideoService: AdsVideoService) {}

  resolve() {
    return forkJoin([this._adsVideoService.getList()]);
  }
}
