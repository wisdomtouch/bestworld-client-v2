import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { AlbumService } from "@services/albums/albums.service";
import { OptionService } from "@services/option/option.service";
import { StylesService } from "@services/styles/styles.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EditResolver {
  constructor(
    private _stylesService: StylesService,
    private _optionService: OptionService,
    private _albumService: AlbumService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([
      this._stylesService.getStyle(),
      this._optionService.getArtistOption(),
      this._optionService.getStyleOption(),
      this._albumService.getByIdAlbum(id ?? ""),
      this._optionService.getPartnerOption(),
    ]);
  }
}
