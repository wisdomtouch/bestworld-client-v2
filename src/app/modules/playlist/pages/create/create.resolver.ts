import { Injectable } from "@angular/core";

import { VideoService } from "@app/services/videos/videos.service";

import { OptionService } from "@services/option/option.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CreateResolver {
  constructor(
    private videoService: VideoService,
    private _optionService: OptionService
  ) {}

  resolve() {
    return forkJoin([
      this.videoService.getVideos(),
      this._optionService.getStyleOption(),
      this._optionService.getPartnerOption(),
    ]);
  }
}
