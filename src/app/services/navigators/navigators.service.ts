import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { Navigators } from "./navigators.type";

@Injectable({
  providedIn: "root",
})
export class NavigatorService {
  private _navigator$: BehaviorSubject<Navigators> = new BehaviorSubject<Navigators>(
    {} as Navigators
  );

  get navigator$(): Observable<Navigators> {
    return this._navigator$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getNavigator(): Observable<Navigators> {
    return this._httpClient.get<Navigators>(`${environment.apiUrl}/admin/navigators`).pipe(
      tap(response => {
        this._navigator$.next(response);
      })
    );
  }
}
