import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { Style, StylePagination, StyleRequest } from "./styles.type";

@Injectable({
  providedIn: "root",
})
export class StylesService {
  private _stylePagination$: BehaviorSubject<StylePagination> =
    new BehaviorSubject<StylePagination>({} as StylePagination);

  get stylePagination$(): Observable<StylePagination> {
    return this._stylePagination$.asObservable();
  }

  private _styleById$: BehaviorSubject<Style> = new BehaviorSubject<Style>({} as Style);

  get styleById$(): Observable<Style> {
    return this._styleById$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getStyle(
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
  ): Observable<StylePagination> {
    return this._httpClient
      .get<StylePagination>(`${environment.apiUrl}/admin/styles`, {
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
          this._stylePagination$.next(response);
        })
      );
  }
  getByIdStyle(id: string | null): Observable<Style> {
    return this._httpClient.get<Style>(`${environment.apiUrl}/admin/styles/${id}`).pipe(
      tap(response => {
        this._styleById$.next(response);
      })
    );
  }

  deleteStyle(id: string | null): Observable<Response> {
    return this._httpClient.delete<Response>(`${environment.apiUrl}/admin/styles/${id}`);
  }

  createStyle(styleRequest: StyleRequest): Observable<Response> {
    return this._httpClient.post<Response>(`${environment.apiUrl}/admin/styles`, styleRequest);
  }

  updateStyle(styleRequest: StyleRequest): Observable<Response> {
    return this._httpClient.put<Response>(`${environment.apiUrl}/admin/styles`, styleRequest);
  }
}
