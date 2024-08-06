import { CreatedBy, Pagination, UpdatedBy, viewStats } from "@app/shared/types/shared.types";

export interface AdsVideoPagination {
  adsVideos: AdsVideo[];
  adsVideosDetail: [];
  pagination: Pagination;
  viewTotal: number;
  clickTotal: number;
  ctrTotal: number;
}

export interface AdsVideo {
  id: string;
  video: string;
  image: string;
  name: string;
  url: string;
  isActive: boolean;
  totalView: number;
  totalClick: number;
  ctr: number;
  publishedAt: Date;
  expiredAt: Date;
  createdBy: CreatedBy;
  updatedBy: UpdatedBy;
  updatedAt: Date;
  editedBy: string;
}
export interface AdsVideoDetailStat {
  totalView: number;
  totalClick: number;
  totalCtr: number;
  viewStats: viewStats[];
}
