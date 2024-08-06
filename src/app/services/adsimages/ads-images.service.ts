import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {
  AdsImage,
  AdsImageDetailStat,
  AdsImagePagination,
} from "@services/adsimages/ads-images.type";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdsImagesService {
  private _adsImages$: BehaviorSubject<AdsImagePagination> =
    new BehaviorSubject<AdsImagePagination>({} as AdsImagePagination);
  get adsImage$(): Observable<AdsImagePagination> {
    return this._adsImages$.asObservable();
  }
  private _adsImageById$: BehaviorSubject<AdsImage> = new BehaviorSubject<AdsImage>({} as AdsImage);
  get adsImageById$(): Observable<AdsImage> {
    return this._adsImageById$.asObservable();
  }
  private _adsImageDetailStat$: BehaviorSubject<AdsImageDetailStat> =
    new BehaviorSubject<AdsImageDetailStat>({} as AdsImageDetailStat);
  get adsVideoDetailStat$(): Observable<AdsImageDetailStat> {
    return this._adsImageDetailStat$.asObservable();
  }
  constructor(private _httpClient: HttpClient) {}
  getListHomeBanner(
    page_site = "",
    position = "",
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
  ): Observable<AdsImagePagination> {
    return this._httpClient
      .get<AdsImagePagination>(`${environment.apiUrl}/admin/ads/ads-images`, {
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
          page_site,
          position,
        },
      })
      .pipe(
        tap(response => {
          this._adsImages$.next(response);
        })
      );
  }
  createAdsBanner(formData: FormData): Observable<void> {
    return this._httpClient.post<void>(`${environment.apiUrl}/admin/ads/ads-images`, formData);
  }

  getById(id: string | null): Observable<AdsImage> {
    return this._httpClient.get<AdsImage>(`${environment.apiUrl}/admin/ads/ads-images/${id}`).pipe(
      tap(response => {
        this._adsImageById$.next(response);
      })
    );
  }
  updateAdsBanner(formData: FormData): Observable<void> {
    return this._httpClient.put<void>(`${environment.apiUrl}/admin/ads/ads-images`, formData);
  }
  delete(id: string | undefined): Observable<Response> {
    return this._httpClient.delete<Response>(`${environment.apiUrl}/admin/ads/ads-images/${id}`);
  }
  getAdsImageDetailStatById(
    id: string | null,
    startDate = "",
    endDate = ""
  ): Observable<AdsImageDetailStat> {
    return this._httpClient
      .get<AdsImageDetailStat>(`${environment.apiUrl}/admin/ads/ads-images/viewer-stats/${id}`, {
        params: { startDate, endDate },
      })
      .pipe(
        tap(response => {
          this._adsImageDetailStat$.next(response);
        })
      );
  }
}
