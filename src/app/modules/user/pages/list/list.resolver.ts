import { Injectable } from "@angular/core";

import { UserService } from "@app/services/users/users.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ListResolver {
  constructor(private _userService: UserService) {}

  resolve() {
    return forkJoin([this._userService.getUser()]);
  }
}
