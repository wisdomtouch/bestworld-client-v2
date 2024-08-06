import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { User, UserPagination } from "./users.type";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private _user$: BehaviorSubject<UserPagination> = new BehaviorSubject<UserPagination>(
    {} as UserPagination
  );

  get user$(): Observable<UserPagination> {
    return this._user$.asObservable();
  }

  private _userById$: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);

  get userById$(): Observable<User> {
    return this._userById$.asObservable();
  }
  constructor(private _httpClient: HttpClient) {}

  getUser(
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
  ): Observable<UserPagination> {
    return this._httpClient
      .get<UserPagination>(`${environment.apiUrl}/admin/users`, {
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
          this._user$.next(response);
        })
      );
  }

  getByIdUser(id: string | null): Observable<User> {
    return this._httpClient.get<User>(`${environment.apiUrl}/admin/users/${id}`).pipe(
      tap(response => {
        this._userById$.next(response);
      })
    );
  }

  updateUser(formData: FormData): Observable<void> {
    return this._httpClient.put<void>(`${environment.apiUrl}/admin/users`, formData);
  }
}
