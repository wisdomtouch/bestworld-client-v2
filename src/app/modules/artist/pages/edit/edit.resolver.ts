import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { ArtistService } from "@services/artists/artists.service";
import { OptionService } from "@services/option/option.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EditResolver {
  constructor(
    private _artistService: ArtistService,
    private _optionService: OptionService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([
      this._artistService.getByIdArtist(id ?? ""),
      this._optionService.getStyleOption(),
    ]);
  }
}
