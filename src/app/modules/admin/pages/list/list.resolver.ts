import { Injectable } from "@angular/core";

import { AdminService } from "@app/services/admin/admin.service";

import { OptionService } from "@services/option/option.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ListResolver {
  constructor(
    private _adminService: AdminService,
    private _optionService: OptionService
  ) {}

  resolve() {
    return forkJoin([this._adminService.getAdmin(), this._optionService.getAdminRolesOption()]);
  }
}
