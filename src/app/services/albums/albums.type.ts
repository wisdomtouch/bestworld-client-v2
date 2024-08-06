import { CreatedBy, Pagination, UpdatedBy } from "@app/shared/types/shared.types";

import { Partner, Video } from "@services/videos/videos.type";

import { Artist, ArtistGroup } from "../artists/artists.type";

export interface AlbumPagination {
  albums: Album[];
  pagination: Pagination;
}

export interface Album {
  id: string;
  name: string;
  slug: string;
  artist: Artist;
  styles: ArtistGroup[];
  videos: Video[];
  isActive: boolean;
  image: string;
  coverPage: string;
  codeColor: string;
  releasedAt: Date;
  publishedAt: Date;
  expiredAt: Date;
  createdAt: string;
  updatedAt: string;
  totalSong: number;
  totalView: number;
  createdBy: CreatedBy;
  updatedBy: UpdatedBy;
  description: string;
  partner: Partner;
}
