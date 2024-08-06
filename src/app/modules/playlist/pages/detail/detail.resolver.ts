import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { PlaylistService } from "@services/playlists/playlists.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DetailResolver {
  constructor(private _playlistService: PlaylistService) {}
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._playlistService.getByIdPlaylist(id)]);
  }
}
