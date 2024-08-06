import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { AdminService } from "@services/admin/admin.service";
import { RoleService } from "@services/roles/roles.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EditResolver {
  constructor(
    private _adminService: AdminService,
    private _roleService: RoleService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._adminService.getAdminById(id), this._roleService.getRoles()]);
  }
}
