import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { TicketService } from "@services/ticket/ticket.service";

import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DetailResolver {
  constructor(private _ticketService: TicketService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return forkJoin([this._ticketService.getByIdTicket(id)]);
  }
}
