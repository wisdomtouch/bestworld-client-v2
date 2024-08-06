import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Partner, PartnerPagination } from "@services/partner/partner.type";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PartnerService {
  private _partnerPagination$: BehaviorSubject<PartnerPagination> =
    new BehaviorSubject<PartnerPagination>({} as PartnerPagination);

  get partnerPagination$(): Observable<PartnerPagination> {
    return this._partnerPagination$.asObservable();
  }

  private _partnerById$: BehaviorSubject<Partner> = new BehaviorSubject<Partner>({} as Partner);

  get partnerById$(): Observable<Partner> {
    return this._partnerById$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getPartners(
    page = 0,
    size = 10,
    sort = "updatedAt",
    order = "desc",
    keyword = "",
    status = ""
  ): Observable<PartnerPagination> {
    return this._httpClient
      .get<PartnerPagination>(`${environment.apiUrl}/admin/partners`, {
        params: {
          page,
          size,
          sort,
          order,
          keyword,
          status,
        },
      })
      .pipe(
        tap(response => {
          this._partnerPagination$.next(response);
        })
      );
  }

  getByIdPartner(id: string | null): Observable<Partner> {
    return this._httpClient.get<Partner>(`${environment.apiUrl}/admin/partners/${id}`).pipe(
      tap(response => {
        this._partnerById$.next(response);
      })
    );
  }

  createPartner(formData: FormData): Observable<void> {
    return this._httpClient.post<void>(`${environment.apiUrl}/admin/partners`, formData);
  }

  updatePartner(formData: FormData): Observable<void> {
    return this._httpClient.put<void>(`${environment.apiUrl}/admin/partners`, formData);
  }
}
