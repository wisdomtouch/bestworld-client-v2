import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { AlbumService } from "@services/albums/albums.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DetailResolver {
  constructor(private _albumService: AlbumService) {}
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._albumService.getByIdAlbum(id)]);
  }
}
