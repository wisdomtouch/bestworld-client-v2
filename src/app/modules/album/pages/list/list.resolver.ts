import { Injectable } from "@angular/core";

import { AlbumService } from "@services/albums/albums.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ListResolver {
  constructor(private _albumService: AlbumService) {}

  resolve() {
    return forkJoin([this._albumService.getAlbum()]);
  }
}
