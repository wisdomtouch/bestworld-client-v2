import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { PartnerService } from "@services/partner/partner.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DetailResolver {
  constructor(private _partnerService: PartnerService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._partnerService.getByIdPartner(id)]);
  }
}
