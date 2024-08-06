import { CreatedBy, Pagination, UpdatedBy } from "@app/shared/types/shared.types";

export interface StylePagination {
  styles: Style[];
  pagination: Pagination;
}

export interface Style {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  totalUsed: number;
  totalListen: number;
  createdAt: Date;
  createdBy: CreatedBy;
  publishedAt: Date;
  updatedAt: Date;
  updatedBy: UpdatedBy;
  songsUsed: number;
  totalView: number;
  view: number;
}

export interface StyleRequest {
  id?: string;
  name: string;
  slug: string;
  isActive: boolean;
}
