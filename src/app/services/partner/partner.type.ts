import { Pagination } from "@app/shared/types/shared.types";

export interface PartnerPagination {
  partner: Partner[];
  pagination: Pagination;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  image: string;
  publishedAt: Date;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
