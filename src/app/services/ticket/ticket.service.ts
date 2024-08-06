import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Ticket, TicketPagination, TicketRequest } from "@services/ticket/ticket.type";

import { environment } from "@environments/environment";

import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TicketService {
  private _ticket$: BehaviorSubject<TicketPagination> = new BehaviorSubject<TicketPagination>(
    {} as TicketPagination
  );

  get ticket$(): Observable<TicketPagination> {
    return this._ticket$.asObservable();
  }

  private _ticketById$: BehaviorSubject<Ticket> = new BehaviorSubject<Ticket>({} as Ticket);

  get ticketById$(): Observable<Ticket> {
    return this._ticketById$.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  getTicket(
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
  ): Observable<TicketPagination> {
    return this._httpClient
      .get<TicketPagination>(`${environment.apiUrl}/admin/ticket-requests`, {
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
          this._ticket$.next(response);
        })
      );
  }

  getByIdTicket(id: string | null): Observable<Ticket> {
    return this._httpClient.get<Ticket>(`${environment.apiUrl}/admin/ticket-requests/${id}`).pipe(
      tap(response => {
        this._ticketById$.next(response);
      })
    );
  }

  updateTicket(ticketRequest: TicketRequest): Observable<void> {
    return this._httpClient.put<void>(`${environment.apiUrl}/admin/ticket-requests`, ticketRequest);
  }
}
