import { CreatedBy, Pagination, UpdatedBy } from "@app/shared/types/shared.types";

import { Style } from "@services/styles/styles.type";

import { Partner, Video } from "../videos/videos.type";

export interface PlaylistPagination {
  playlists: Playlists[];
  pagination: Pagination;
}

export interface Playlists {
  id: string;
  name: string;
  description: string;
  detail: string;
  slug: string;
  image: string;
  coverPage: string;
  codeColor: string;
  units: number;
  view: number;
  isActive: boolean;
  releasedAt: Date;
  publishedAt: Date;
  expiredAt: Date;
  createdAt: Date;
  createdBy: CreatedBy;
  updatedAt: Date;
  updatedBy: UpdatedBy;
  videos: Video[];
  style: Style[];
  partner: Partner;
}
