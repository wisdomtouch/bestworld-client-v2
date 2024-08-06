import { Injectable } from "@angular/core";

import { PartnerService } from "@services/partner/partner.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ListResolver {
  constructor(private _partnerService: PartnerService) {}

  resolve() {
    return forkJoin([this._partnerService.getPartners()]);
  }
}
