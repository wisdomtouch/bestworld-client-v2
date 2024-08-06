import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { ArtistService } from "@services/artists/artists.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DetailResolver {
  constructor(private _artistService: ArtistService) {}
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._artistService.getByIdArtist(id)]);
  }
}
