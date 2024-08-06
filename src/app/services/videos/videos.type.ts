import { CreatedBy, Pagination, UpdatedBy, ViewerStats } from "@app/shared/types/shared.types";

import { Album } from "../albums/albums.type";
import { Artist } from "../artists/artists.type";
import { Style } from "../styles/styles.type";

export interface VideoPagination {
  videos: Video[];
  pagination: Pagination;
}

export interface Video {
  id: string;
  name: string;
  slug: string;
  description: string;
  styles: Style[];
  artists: Artist[];
  album: Album;
  lyrics: string;
  status: string;
  isActive: boolean;
  view: number;
  releasedAt: string;
  publishedAt: string;
  expiredAt: string;
  image: string;
  video: string;
  createdAt: string;
  updatedAt: string;
  createdBy: CreatedBy;
  updatedBy: UpdatedBy;
  viewerStats: ViewerStats[];
  favorite: number;
  partner: Partner;
}

export interface Partner {
  createdAt: string;
  description: string;
  expiredAt: string;
  id: string;
  image: string;
  name: string;
  publishedAt: string;
  updatedAt: string;
}

export interface LalalaiResp {
  status: string;
  id: string;
  size: number;
  duration: number;
  expires: number;
  error: string;
}

export interface SplitResp {
  status: string;
  error: string;
}

export interface VideoStat {
  totalVideos: number;
  videoStartDate: Date;
  viewerStats: ViewerStats;
  videos: Video[];
}
