import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { Content, ContentRequest } from "./content.type";

@Injectable({
  providedIn: "root",
})
export class ContentService {
  private _contentCookiesPolicy$: BehaviorSubject<Content> = new BehaviorSubject<Content>(
    {} as Content
  );

  get contentCookiesPolicy$(): Observable<Content> {
    return this._contentCookiesPolicy$.asObservable();
  }

  private _contentPrivacyPolicy$: BehaviorSubject<Content> = new BehaviorSubject<Content>(
    {} as Content
  );

  get contentPrivacyPolicy$(): Observable<Content> {
    return this._contentPrivacyPolicy$.asObservable();
  }

  private _contentTermOfUse$: BehaviorSubject<Content> = new BehaviorSubject<Content>(
    {} as Content
  );

  get contentTermOfUse$(): Observable<Content> {
    return this._contentTermOfUse$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getCookiesPolicy(): Observable<Content> {
    return this._httpClient.get<Content>(`${environment.apiUrl}/admin/content/cookies-policy`).pipe(
      tap(response => {
        this._contentCookiesPolicy$.next(response);
      })
    );
  }

  getPrivacyPolicy(): Observable<Content> {
    return this._httpClient.get<Content>(`${environment.apiUrl}/admin/content/privacy-policy`).pipe(
      tap(response => {
        this._contentPrivacyPolicy$.next(response);
      })
    );
  }
  getTermOfUse(): Observable<Content> {
    return this._httpClient.get<Content>(`${environment.apiUrl}/admin/content/term-of-use`).pipe(
      tap(response => {
        this._contentTermOfUse$.next(response);
      })
    );
  }

  updateContent(contentRequest: ContentRequest): Observable<Response> {
    return this._httpClient.put<Response>(`${environment.apiUrl}/admin/content`, contentRequest);
  }
}
