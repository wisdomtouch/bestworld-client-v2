import { Injectable } from "@angular/core";

import { BannerService } from "@services/banners/banners.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrderResolver {
  constructor(private _bannerService: BannerService) {}

  resolve() {
    return forkJoin([this._bannerService.getBanner(0, 10, "order")]);
  }
}
