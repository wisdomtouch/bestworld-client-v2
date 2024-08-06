import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { VideoService } from "@app/services/videos/videos.service";

import { OptionService } from "@services/option/option.service";
import { PlaylistService } from "@services/playlists/playlists.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EditResolver {
  constructor(
    private _videoService: VideoService,
    private _playlistService: PlaylistService,
    private _optionService: OptionService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([
      this._videoService.getVideos(),
      this._playlistService.getByIdPlaylist(id ?? ""),
      this._optionService.getStyleOption(),
      this._optionService.getPartnerOption(),
    ]);
  }
}
