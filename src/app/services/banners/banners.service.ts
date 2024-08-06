import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { Banner, BannerPagination } from "./banners.type";

@Injectable({
  providedIn: "root",
})
export class BannerService {
  private _bannerPagination$: BehaviorSubject<BannerPagination> =
    new BehaviorSubject<BannerPagination>({} as BannerPagination);

  get bannerPagination$(): Observable<BannerPagination> {
    return this._bannerPagination$.asObservable();
  }

  private _bannerById$: BehaviorSubject<Banner> = new BehaviorSubject<Banner>({} as Banner);

  get bannerById$(): Observable<Banner> {
    return this._bannerById$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getBanner(
    page = 0,
    size = 10,
    sort = "order",
    order = "desc",
    keyword = "",
    status = "",
    keyNameCreated = "",
    keyNameUpdated = ""
  ): Observable<BannerPagination> {
    return this._httpClient
      .get<BannerPagination>(`${environment.apiUrl}/admin/banners`, {
        params: {
          page,
          size,
          sort,
          order,
          keyword,
          status,
          keyNameCreated,
          keyNameUpdated,
        },
      })
      .pipe(
        tap(response => {
          this._bannerPagination$.next(response);
        })
      );
  }
  getByIdBanner(id: string): Observable<Banner> {
    return this._httpClient.get<Banner>(`${environment.apiUrl}/admin/banners/${id}`).pipe(
      tap(response => {
        this._bannerById$.next(response);
      })
    );
  }

  deleteBanner(id: string | null): Observable<Response> {
    return this._httpClient.delete<Response>(`${environment.apiUrl}/admin/banners/${id}`);
  }

  createBanner(formData: FormData): Observable<void> {
    return this._httpClient.post<void>(`${environment.apiUrl}/admin/banners`, formData);
  }

  updateBanner(formData: FormData): Observable<void> {
    return this._httpClient.put<void>(`${environment.apiUrl}/admin/banners`, formData);
  }
}
