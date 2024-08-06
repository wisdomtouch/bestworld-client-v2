import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Constant } from "@app/shared/constants/constant";
import { localStorageConstants } from "@app/shared/constants/local-storage.constants";
import { AuthUtils } from "@app/shared/utils/auth.utils";

import { AuthToken, SignInRequest } from "@services/auth/auth.types";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, of } from "rxjs";
import { switchMap } from "rxjs/internal/operators/switchMap";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private _httpClient: HttpClient) {}

  private _isAuthenticate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get accessToken(): string {
    return localStorage.getItem(localStorageConstants.AUTH_ACCESS_TOKEN) ?? "";
  }

  set accessToken(token: string) {
    localStorage.setItem(localStorageConstants.AUTH_ACCESS_TOKEN, token);
  }

  get refreshToken(): string {
    return localStorage.getItem(localStorageConstants.AUTH_REFRESH_TOKEN) ?? "";
  }

  set refreshToken(token: string) {
    localStorage.setItem(localStorageConstants.AUTH_REFRESH_TOKEN, token);
  }

  getUser(): string {
    return localStorage.getItem(Constant.accessUser) ?? "";
  }

  signIn(signInRequest: SignInRequest): Observable<AuthToken> {
    if (this._isAuthenticate$.value) {
      throw new Error("sd");
    }

    return this._httpClient
      .post<AuthToken>(`${environment.apiUrl}/admin/sign-in`, signInRequest)
      .pipe(
        switchMap((response: AuthToken) => {
          if (response.accessToken) {
            this.accessToken = response.accessToken;
            this.refreshToken = response.refreshToken;
            this._isAuthenticate$.next(true);
            return of(response);
          }
          return of(response);
        })
      );
  }
  signOut(): Observable<boolean> {
    localStorage.removeItem(localStorageConstants.AUTH_ACCESS_TOKEN);
    localStorage.removeItem(localStorageConstants.AUTH_REFRESH_TOKEN);
    this._isAuthenticate$.next(false);
    return of(true);
  }

  checkAuthenticate(): Observable<boolean> {
    if (this._isAuthenticate$.value) {
      return of(true);
    }

    if (!this.accessToken) {
      return of(false);
    }

    if (!AuthUtils.isTokenExpired(this.accessToken)) {
      return of(true);
    }

    return of(false);
  }
}
