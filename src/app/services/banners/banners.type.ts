import { Pagination } from "@app/shared/types/shared.types";

export interface BannerPagination {
  banners: Banner[];
  pagination: Pagination;
}

export interface Banner {
  id: string;
  name: string;
  link: string;
  order: number;
  isActive: boolean;
  imageDesktop: string;
  imageIpad: string;
  imageMobile: string;
  publishedAt: Date;
  expiredAt: Date;
  createdAt: string;
  updatedAt: string;
}

export interface BannerDetail {
  detail: Detail[];
  pagination: Pagination;
}

export interface Detail {
  date: string;
  click: string;
  view: string;
  ctr: string;
}
