import { Injectable } from "@angular/core";

import { VideoService } from "@services/videos/videos.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StatisticResolver {
  constructor(private _videoService: VideoService) {}
  resolve() {
    return forkJoin([this._videoService.getVideoStat()]);
  }
}
