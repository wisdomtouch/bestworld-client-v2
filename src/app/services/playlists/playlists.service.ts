import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { PlaylistPagination, Playlists } from "./playlists.type";

@Injectable({
  providedIn: "root",
})
export class PlaylistService {
  private _playlistPagination$: BehaviorSubject<PlaylistPagination> =
    new BehaviorSubject<PlaylistPagination>({} as PlaylistPagination);

  get playlistPagination$(): Observable<PlaylistPagination> {
    return this._playlistPagination$.asObservable();
  }

  private _playlistById$: BehaviorSubject<Playlists> = new BehaviorSubject<Playlists>(
    {} as Playlists
  );

  get playlistById$(): Observable<Playlists> {
    return this._playlistById$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getPlaylists(
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
  ): Observable<PlaylistPagination> {
    return this._httpClient
      .get<PlaylistPagination>(`${environment.apiUrl}/admin/playlists`, {
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
          this._playlistPagination$.next(response);
        })
      );
  }

  getByIdPlaylist(id: string | null): Observable<Playlists> {
    return this._httpClient.get<Playlists>(`${environment.apiUrl}/admin/playlists/${id}`).pipe(
      tap(response => {
        this._playlistById$.next(response);
      })
    );
  }

  createPlaylist(formData: FormData): Observable<void> {
    return this._httpClient.post<void>(`${environment.apiUrl}/admin/playlists`, formData);
  }

  updatePlaylist(formData: FormData): Observable<void> {
    return this._httpClient.put<void>(`${environment.apiUrl}/admin/playlists`, formData);
  }
}
