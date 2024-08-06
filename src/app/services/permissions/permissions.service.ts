import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { Permissions, UpdatePermission } from "./permissions.types";

@Injectable({
  providedIn: "root",
})
export class PermissionService {
  constructor(private _httpClient: HttpClient) {}

  private _permissions$: BehaviorSubject<Permissions[]> = new BehaviorSubject<Permissions[] | []>(
    []
  );

  get permissions$(): Observable<Permissions[]> {
    return this._permissions$.asObservable();
  }

  getPermissions(): Observable<Permissions[]> {
    return this._httpClient.get<Permissions[]>(`${environment.apiUrl}/admin/permissions`).pipe(
      tap(response => {
        this._permissions$.next(response);
      })
    );
  }

  updatePermission(updatePermission: UpdatePermission): Observable<Response> {
    return this._httpClient.patch<Response>(
      `${environment.apiUrl}/admin/permissions`,
      updatePermission
    );
  }
}
