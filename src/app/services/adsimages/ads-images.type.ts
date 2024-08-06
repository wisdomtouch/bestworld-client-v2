import { CreatedBy, Pagination, UpdatedBy, viewStats } from "@app/shared/types/shared.types";

export interface AdsImagePagination {
  adsImages: AdsImage[];
  adsImageDetail: [];
  pagination: Pagination;
  viewTotal: number;
  clickTotal: number;
  ctrTotal: number;
}
export interface AdsImage {
  id: string;
  name: string;
  url: string;
  view: number;
  ctr: number;
  imageDesktop: string;
  imageMobile: string;
  click: number;
  position: string;
  isActive: boolean;
  publishedAt: Date;
  expiredAt: Date;
  createdBy: CreatedBy;
  updatedBy: UpdatedBy;
  updatedAt: Date;
}
export interface AdsImageDetailStat {
  totalView: number;
  totalClick: number;
  totalCtr: number;
  viewStats: viewStats[];
}
