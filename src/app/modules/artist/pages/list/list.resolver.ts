import { Injectable } from "@angular/core";

import { ArtistService } from "@services/artists/artists.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ListResolver {
  constructor(private _artistService: ArtistService) {}

  resolve() {
    return forkJoin([this._artistService.getArtist()]);
  }
}
