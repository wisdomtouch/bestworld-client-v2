import { Injectable } from "@angular/core";

import { PlaylistService } from "@services/playlists/playlists.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ListResolver {
  constructor(private _playlistService: PlaylistService) {}

  resolve() {
    return forkJoin([this._playlistService.getPlaylists()]);
  }
}
