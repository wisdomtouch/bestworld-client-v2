import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { Admin, AdminPagination } from "./admin.type";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private _admin$: BehaviorSubject<AdminPagination> = new BehaviorSubject<AdminPagination>(
    {} as AdminPagination
  );

  get admin$(): Observable<AdminPagination> {
    return this._admin$.asObservable();
  }

  private _adminById$: BehaviorSubject<Admin> = new BehaviorSubject<Admin | object>({});

  get adminById$(): Observable<Admin> {
    return this._adminById$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  createAdmin(formData: FormData): Observable<Response> {
    return this._httpClient.post<Response>(`${environment.apiUrl}/admin/admins`, formData);
  }

  updateAdmin(formData: FormData): Observable<Response> {
    return this._httpClient.put<Response>(`${environment.apiUrl}/admin/admins`, formData);
  }

  deleteAdmin(id: string | null): Observable<Response> {
    return this._httpClient.delete<Response>(`${environment.apiUrl}/admin/admins/${id}`);
  }

  getAdmin(
    page = 0,
    size = 30,
    sort = "updatedAt",
    order = "desc",
    roleId = "",
    keyword = "",
    status = "",
    startDate = "",
    endDate = "",
    keyNameCreated = "",
    keyNameUpdated = ""
  ): Observable<AdminPagination> {
    return this._httpClient
      .get<AdminPagination>(`${environment.apiUrl}/admin/admins`, {
        params: {
          page,
          size,
          sort,
          order,
          roleId,
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
          this._admin$.next(response);
        })
      );
  }

  getAdminById(id: string | null): Observable<Admin> {
    return this._httpClient.get<Admin>(`${environment.apiUrl}/admin/admins/${id}`).pipe(
      tap(response => {
        this._adminById$.next(response);
      })
    );
  }
}
