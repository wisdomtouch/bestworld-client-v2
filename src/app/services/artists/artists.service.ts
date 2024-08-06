import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { Artist, ArtistPagination, ArtistStat } from "./artists.type";

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  private _artistPagination$: BehaviorSubject<ArtistPagination> =
    new BehaviorSubject<ArtistPagination>({} as ArtistPagination);

  get artistPagination$(): Observable<ArtistPagination> {
    return this._artistPagination$.asObservable();
  }

  private _artistById$: BehaviorSubject<Artist> = new BehaviorSubject<Artist>({} as Artist);

  get artistById$(): Observable<Artist> {
    return this._artistById$.asObservable();
  }

  private _artistStat$: BehaviorSubject<ArtistStat> = new BehaviorSubject<ArtistStat>(
    {} as ArtistStat
  );

  get artistStat$(): Observable<ArtistStat> {
    return this._artistStat$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getArtist(
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
  ): Observable<ArtistPagination> {
    return this._httpClient
      .get<ArtistPagination>(`${environment.apiUrl}/admin/artists`, {
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
          this._artistPagination$.next(response);
        })
      );
  }
  getByIdArtist(id: string | null): Observable<Artist> {
    return this._httpClient.get<Artist>(`${environment.apiUrl}/admin/artists/${id}`).pipe(
      tap(response => {
        this._artistById$.next(response);
      })
    );
  }

  deleteArtist(id: string | null): Observable<Response> {
    return this._httpClient.delete<Response>(`${environment.apiUrl}/admin/artists/${id}`);
  }

  createArtist(formData: FormData): Observable<void> {
    return this._httpClient.post<void>(`${environment.apiUrl}/admin/artists`, formData);
  }

  updateArtist(formData: FormData): Observable<void> {
    return this._httpClient.put<void>(`${environment.apiUrl}/admin/artists`, formData);
  }

  getArtistStat(): Observable<ArtistStat> {
    return this._httpClient.get<ArtistStat>(`${environment.apiUrl}/admin/artists/stats`).pipe(
      tap(response => {
        this._artistStat$.next(response);
      })
    );
  }
}
