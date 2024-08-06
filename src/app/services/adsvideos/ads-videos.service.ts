import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {
  AdsVideo,
  AdsVideoDetailStat,
  AdsVideoPagination,
} from "@services/adsvideos/ads-videos.type";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdsVideoService {
  private _adsVideo$: BehaviorSubject<AdsVideoPagination> = new BehaviorSubject<AdsVideoPagination>(
    {} as AdsVideoPagination
  );
  get adsVideo$(): Observable<AdsVideoPagination> {
    return this._adsVideo$.asObservable();
  }

  private _adsVideoById$: BehaviorSubject<AdsVideo> = new BehaviorSubject<AdsVideo>({} as AdsVideo);
  get adsVideoById$(): Observable<AdsVideo> {
    return this._adsVideoById$.asObservable();
  }

  private _adsVideoDetailStat$: BehaviorSubject<AdsVideoDetailStat> =
    new BehaviorSubject<AdsVideoDetailStat>({} as AdsVideoDetailStat);
  get adsVideoDetailStat$(): Observable<AdsVideoDetailStat> {
    return this._adsVideoDetailStat$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getList(
    page = 0,
    size = 10,
    sort = "updatedAt",
    order = "desc",
    keyword = "",
    keyActive = "",
    startDate = "",
    endDate = "",
    keyNameCreated = "",
    keyNameUpdated = ""
  ): Observable<AdsVideoPagination> {
    return this._httpClient
      .get<AdsVideoPagination>(`${environment.apiUrl}/admin/ads/ads-videos`, {
        params: {
          page,
          size,
          sort,
          order,
          keyword,
          keyActive,
          startDate,
          endDate,
          keyNameCreated,
          keyNameUpdated,
        },
      })
      .pipe(
        tap(response => {
          this._adsVideo$.next(response);
        })
      );
  }
  getAdsVideosDetailStatById(
    id: string | null,
    startDate = "",
    endDate = ""
  ): Observable<AdsVideoDetailStat> {
    return this._httpClient
      .get<AdsVideoDetailStat>(`${environment.apiUrl}/admin/ads/ads-videos/viewer-stats/${id}`, {
        params: { startDate, endDate },
      })
      .pipe(
        tap(response => {
          this._adsVideoDetailStat$.next(response);
        })
      );
  }
  create(formData: FormData): Observable<void> {
    return this._httpClient.post<void>(`${environment.apiUrl}/admin/ads/ads-videos`, formData);
  }
  getById(id: string | null): Observable<AdsVideo> {
    return this._httpClient.get<AdsVideo>(`${environment.apiUrl}/admin/ads/ads-videos/${id}`).pipe(
      tap(response => {
        this._adsVideoById$.next(response);
      })
    );
  }
  update(formData: FormData): Observable<void> {
    return this._httpClient.put<void>(`${environment.apiUrl}/admin/ads/ads-videos`, formData);
  }
  delete(id: string | null): Observable<Response> {
    return this._httpClient.delete<Response>(`${environment.apiUrl}/admin/ads/ads-videos/${id}`);
  }
}
