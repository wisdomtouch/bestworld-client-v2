import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { optionDefault } from "@app/services/option/option.constants";
import {
  AdminRoleOption,
  AlbumsOption,
  ArtistsOption,
  Option,
  PartnerOption,
  StyleOption,
} from "@app/services/option/option.types";
import { localStorageConstants } from "@app/shared/constants/local-storage.constants";

import { VideoPagination } from "@services/videos/videos.type";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OptionService {
  private _option$: BehaviorSubject<Option> = new BehaviorSubject<Option>(optionDefault);

  private _artistOption$: BehaviorSubject<ArtistsOption[]> = new BehaviorSubject<
    ArtistsOption[] | []
  >([]);

  get artistOption$(): Observable<ArtistsOption[]> {
    return this._artistOption$.asObservable();
  }

  private _styleOption$: BehaviorSubject<StyleOption[]> = new BehaviorSubject<StyleOption[] | []>(
    []
  );

  get styleOption$(): Observable<StyleOption[]> {
    return this._styleOption$.asObservable();
  }

  private _albumsOption$: BehaviorSubject<AlbumsOption[]> = new BehaviorSubject<
    AlbumsOption[] | []
  >([]);

  get albumsOption$(): Observable<AlbumsOption[]> {
    return this._albumsOption$.asObservable();
  }

  private _videoOption$: BehaviorSubject<VideoPagination> = new BehaviorSubject<VideoPagination>(
    {} as VideoPagination
  );

  get videoOption$(): Observable<VideoPagination> {
    return this._videoOption$.asObservable();
  }

  private _partnerOption$: BehaviorSubject<PartnerOption[]> = new BehaviorSubject<
    PartnerOption[] | []
  >([]);

  get partnerOption$(): Observable<PartnerOption[]> {
    return this._partnerOption$.asObservable();
  }
  private _adminRoleOption$: BehaviorSubject<AdminRoleOption[]> = new BehaviorSubject<
    AdminRoleOption[] | []
  >([]);

  get adminRoleOption$(): Observable<AdminRoleOption[]> {
    return this._adminRoleOption$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  get option$(): Observable<Option> {
    return this._option$.asObservable();
  }

  getOption(): Observable<Option> {
    const themeSetting = localStorage.getItem(localStorageConstants.THEME_SETTING);
    const dir = localStorage.getItem(localStorageConstants.THEME_DIR ?? "ltr");
    const theme = localStorage.getItem(localStorageConstants.THEME ?? "light");
    const sidenavOpened =
      localStorage.getItem(localStorageConstants.THEME_SIDENAV_OPENED) ?? "false";
    const sidenavCollapsed = localStorage.getItem(localStorageConstants.THEME_SIDENAV_COLLAPSED);
    const boxed = localStorage.getItem(localStorageConstants.THEME_BOXED);
    const horizontal = localStorage.getItem(localStorageConstants.THEME_HORIZONTAL);
    const cardBorder = localStorage.getItem(localStorageConstants.THEME_CARD_BORDER);
    const activeTheme = localStorage.getItem(localStorageConstants.THEME_ACTIVE);
    const language = localStorage.getItem(localStorageConstants.THEME_LANGUAGE);
    const navPos = localStorage.getItem(localStorageConstants.THEME_NAV_POS);

    const option = {
      dir: dir ?? "ltr",
      theme: theme ?? "light",
      sidenavOpened: sidenavOpened?.toLowerCase() == "true",
      sidenavCollapsed: sidenavCollapsed?.toLowerCase() == "true",
      boxed: boxed?.toLowerCase() == "true",
      horizontal: horizontal?.toLowerCase() == "true",
      cardBorder: cardBorder?.toLowerCase() == "true",
      activeTheme: activeTheme ?? "purple_theme",
      language: language ?? "en-us",
      navPos: navPos ?? "side",
    } as Option;
    if (!themeSetting) {
      this.setOption(option);
      return of(option);
    }

    this._option$.next(option);
    return of(option);
  }

  setOption(option: Option) {
    localStorage.setItem(localStorageConstants.THEME_SETTING, String(true));
    localStorage.setItem(localStorageConstants.THEME_DIR, option.dir);
    localStorage.setItem(localStorageConstants.THEME, option.theme);
    localStorage.setItem(localStorageConstants.THEME_SIDENAV_OPENED, String(option.sidenavOpened));
    localStorage.setItem(
      localStorageConstants.THEME_SIDENAV_COLLAPSED,
      String(option.sidenavCollapsed)
    );
    localStorage.setItem(localStorageConstants.THEME_BOXED, String(option.boxed));
    localStorage.setItem(localStorageConstants.THEME_HORIZONTAL, String(option.horizontal));
    localStorage.setItem(localStorageConstants.THEME_CARD_BORDER, String(option.cardBorder));
    localStorage.setItem(localStorageConstants.THEME_ACTIVE, option.activeTheme);
    localStorage.setItem(localStorageConstants.THEME_LANGUAGE, option.language);
    localStorage.setItem(localStorageConstants.THEME_NAV_POS, option.navPos);

    this._option$.next(option);
  }

  getArtistOption(): Observable<ArtistsOption[]> {
    return this._httpClient
      .get<ArtistsOption[]>(
        `${environment.apiUrl}/admin/options/artists
      `
      )
      .pipe(
        tap(response => {
          this._artistOption$.next(response);
        })
      );
  }

  getStyleOption(): Observable<StyleOption[]> {
    return this._httpClient
      .get<StyleOption[]>(
        `${environment.apiUrl}/admin/options/styles
      `
      )
      .pipe(
        tap(response => {
          this._styleOption$.next(response);
        })
      );
  }
  getAdminRolesOption(): Observable<AdminRoleOption[]> {
    return this._httpClient
      .get<AdminRoleOption[]>(
        `${environment.apiUrl}/admin/options/adminroles
      `
      )
      .pipe(
        tap(response => {
          this._adminRoleOption$.next(response);
        })
      );
  }

  getAlbumsOption(id: string): Observable<AlbumsOption[]> {
    return this._httpClient
      .get<AlbumsOption[]>(
        `${environment.apiUrl}/admin/options/albums/${id}
      `
      )
      .pipe(
        tap(response => {
          this._albumsOption$.next(response);
        })
      );
  }

  getVideoOptionByArtist(
    id: string,
    page = 0,
    size = 10,
    sort = "updatedAt",
    order = "desc",
    keyword = ""
  ): Observable<VideoPagination> {
    return this._httpClient
      .get<VideoPagination>(`${environment.apiUrl}/admin/options/artist/${id}`, {
        params: {
          page,
          size,
          sort,
          order,
          keyword,
        },
      })
      .pipe(
        tap(response => {
          this._videoOption$.next(response);
        })
      );
  }

  getPartnerOption(): Observable<PartnerOption[]> {
    return this._httpClient
      .get<PartnerOption[]>(
        `${environment.apiUrl}/admin/options/partner
      `
      )
      .pipe(
        tap(response => {
          this._partnerOption$.next(response);
        })
      );
  }
}
