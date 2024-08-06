import { Injectable } from "@angular/core";

import { RoleService } from "@app/services/roles/roles.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CreateResolver {
  constructor(private _roleService: RoleService) {}

  resolve() {
    return forkJoin([this._roleService.getRoles()]);
  }
}
