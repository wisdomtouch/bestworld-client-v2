import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { Album, AlbumPagination } from "./albums.type";

@Injectable({
  providedIn: "root",
})
export class AlbumService {
  private _albumPagination$: BehaviorSubject<AlbumPagination> =
    new BehaviorSubject<AlbumPagination>({} as AlbumPagination);

  get albumPagination$(): Observable<AlbumPagination> {
    return this._albumPagination$.asObservable();
  }

  private _albumById$: BehaviorSubject<Album> = new BehaviorSubject<Album>({} as Album);

  get albumById$(): Observable<Album> {
    return this._albumById$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getAlbum(
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
  ): Observable<AlbumPagination> {
    return this._httpClient
      .get<AlbumPagination>(`${environment.apiUrl}/admin/albums`, {
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
          this._albumPagination$.next(response);
        })
      );
  }
  getByIdAlbum(id: string | null): Observable<Album> {
    return this._httpClient.get<Album>(`${environment.apiUrl}/admin/albums/${id}`).pipe(
      tap(response => {
        this._albumById$.next(response);
      })
    );
  }

  deleteAlbum(id: string | null): Observable<Response> {
    return this._httpClient.delete<Response>(`${environment.apiUrl}/admin/albums/${id}`);
  }

  createAlbum(formData: FormData): Observable<void> {
    return this._httpClient.post<void>(`${environment.apiUrl}/admin/albums`, formData);
  }

  updateAlbum(formData: FormData): Observable<void> {
    return this._httpClient.put<void>(`${environment.apiUrl}/admin/albums`, formData);
  }
}
