import { Injectable } from "@angular/core";

import { PermissionService } from "@app/services/permissions/permissions.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CreateResolver {
  constructor(private _roleService: PermissionService) {}

  resolve() {
    return forkJoin([this._roleService.getPermissions()]);
  }
}
