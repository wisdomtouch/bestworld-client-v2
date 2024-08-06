import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { UserService } from "@app/services/users/users.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EditResolver {
  constructor(private _userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._userService.getByIdUser(id)]);
  }
}
