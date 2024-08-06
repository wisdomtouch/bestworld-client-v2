import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { Role, RoleRequest, RolesPagination, UpdateRole } from "./roles.types";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  constructor(private _httpClient: HttpClient) {}

  private _roles$: BehaviorSubject<RolesPagination> = new BehaviorSubject<RolesPagination>(
    {} as RolesPagination
  );

  private _rolesById$: BehaviorSubject<Role> = new BehaviorSubject<Role>({} as Role);

  get roles$(): Observable<RolesPagination> {
    return this._roles$.asObservable();
  }

  get rolesById$(): Observable<Role> {
    return this._rolesById$.asObservable();
  }

  getRoles(
    page = 0,
    size = 10,
    sort = "updatedAt",
    order = "desc",
    keyword = "",
    status = "",
    startDate = "",
    endDate = "",
    keyNameCreated = "",
    keyNameUpdated = ""
  ): Observable<RolesPagination> {
    return this._httpClient
      .get<RolesPagination>(`${environment.apiUrl}/admin/roles`, {
        params: {
          page,
          size,
          sort,
          order,
          keyword,
          status,
          startDate,
          endDate,
          keyNameCreated,
          keyNameUpdated,
        },
      })
      .pipe(
        tap(response => {
          this._roles$.next(response);
        })
      );
  }

  createRole(role: RoleRequest): Observable<Response> {
    return this._httpClient.post<Response>(`${environment.apiUrl}/admin/roles`, role);
  }

  getRoleById(id: string | null): Observable<Role> {
    return this._httpClient.get<Role>(`${environment.apiUrl}/admin/roles/` + id).pipe(
      tap(response => {
        this._rolesById$.next(response);
      })
    );
  }

  updateRole(updateUser: UpdateRole): Observable<Response> {
    return this._httpClient.put<Response>(`${environment.apiUrl}/admin/roles`, updateUser);
  }

  deleteRole(id: string | null): Observable<Response> {
    return this._httpClient.delete<Response>(`${environment.apiUrl}/admin/roles/${id}`);
  }
}
