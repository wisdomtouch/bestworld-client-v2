import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { OptionService } from "@services/option/option.service";
import { VideoService } from "@services/videos/videos.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EditResolver {
  constructor(
    private _videoService: VideoService,
    private _optionService: OptionService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([
      this._videoService.getByIdVideo(id ?? ""),
      this._optionService.getStyleOption(),
      this._optionService.getArtistOption(),
      this._optionService.getPartnerOption(),
    ]);
  }
}
