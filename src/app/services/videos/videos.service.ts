import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ViewerStats } from "@app/shared/types/shared.types";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { Video, VideoPagination, VideoStat } from "./videos.type";

@Injectable({
  providedIn: "root",
})
export class VideoService {
  private _videoPagination$: BehaviorSubject<VideoPagination> =
    new BehaviorSubject<VideoPagination>({} as VideoPagination);

  get videoPagination$(): Observable<VideoPagination> {
    return this._videoPagination$.asObservable();
  }

  private _videoById$: BehaviorSubject<Video> = new BehaviorSubject<Video>({} as Video);

  get videoById$(): Observable<Video> {
    return this._videoById$.asObservable();
  }

  private _videoStat$: BehaviorSubject<VideoStat> = new BehaviorSubject<VideoStat>({} as VideoStat);

  get videoStat$(): Observable<VideoStat> {
    return this._videoStat$.asObservable();
  }

  private _videoViewerStat$: BehaviorSubject<ViewerStats> = new BehaviorSubject<ViewerStats>(
    {} as ViewerStats
  );

  get videoViewerStat$(): Observable<ViewerStats> {
    return this._videoViewerStat$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getVideos(
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
  ): Observable<VideoPagination> {
    return this._httpClient
      .get<VideoPagination>(`${environment.apiUrl}/admin/videos`, {
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
          this._videoPagination$.next(response);
        })
      );
  }
  getByIdVideo(id: string | null): Observable<Video> {
    return this._httpClient.get<Video>(`${environment.apiUrl}/admin/videos/${id}/`).pipe(
      tap(response => {
        this._videoById$.next(response);
      })
    );
  }

  createVideo(formData: FormData): Observable<void> {
    return this._httpClient.post<void>(`${environment.apiUrl}/admin/videos`, formData);
  }

  updateVideo(formData: FormData): Observable<void> {
    return this._httpClient.put<void>(`${environment.apiUrl}/admin/videos`, formData);
  }

  deleteVideo(id: string | null): Observable<Response> {
    return this._httpClient.delete<Response>(`${environment.apiUrl}/admin/videos/${id}`);
  }
  getVideoStat(): Observable<VideoStat> {
    return this._httpClient.get<VideoStat>(`${environment.apiUrl}/admin/videos/stats`).pipe(
      tap(response => {
        this._videoStat$.next(response);
      })
    );
  }
  getVideoViewerStat(startDate = "", endDate = ""): Observable<ViewerStats> {
    return this._httpClient
      .get<ViewerStats>(`${environment.apiUrl}/admin/videos/viewer-stats`, {
        params: { startDate, endDate },
      })
      .pipe(
        tap(response => {
          this._videoViewerStat$.next(response);
        })
      );
  }

  getVideoViewerStatById(id: string, startDate = "", endDate = ""): Observable<ViewerStats[]> {
    return this._httpClient.get<ViewerStats[]>(
      `${environment.apiUrl}/admin/videos/viewer-stats/${id}`,
      {
        params: { startDate, endDate },
      }
    );
  }
}
