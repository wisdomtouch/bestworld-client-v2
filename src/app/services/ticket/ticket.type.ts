import { CreatedBy } from "@app/shared/types/shared.types";

import { Partner } from "@services/partner/partner.type";
import { Pagination } from "@services/users/users.type";

export interface TicketPagination {
  tickets: Ticket[];
  pagination: Pagination;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  reason: string;
  file: File[];
  partner: Partner;
  createdAt: string;
  updatedAt: string;
  createdBy: CreatedBy;
  updatedBy: CreatedBy;
}

export interface File {
  id: string;
  file: string;
}

export interface TicketRequest {
  id?: string;
  reason: string;
  status: string;
}
