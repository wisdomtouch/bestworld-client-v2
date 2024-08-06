import { Injectable } from "@angular/core";

import { OptionService } from "@services/option/option.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CreateResolver {
  constructor(private _optionService: OptionService) {}

  resolve() {
    return forkJoin([
      this._optionService.getStyleOption(),
      this._optionService.getArtistOption(),
      this._optionService.getPartnerOption(),
    ]);
  }
}
