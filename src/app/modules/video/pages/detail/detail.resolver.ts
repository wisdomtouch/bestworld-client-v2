import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { VideoService } from "@services/videos/videos.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DetailResolver {
  constructor(private _videoService: VideoService) {}
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._videoService.getByIdVideo(id)]);
  }
}
