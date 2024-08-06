import { Injectable } from "@angular/core";

import { TicketService } from "@services/ticket/ticket.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ListResolver {
  constructor(private _ticketService: TicketService) {}

  resolve() {
    return forkJoin([this._ticketService.getTicket()]);
  }
}
