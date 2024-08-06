import { CreatedBy, Pagination, UpdatedBy } from "@app/shared/types/shared.types";

export interface ArtistPagination {
  artists: Artist[];
  pagination: Pagination;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  codeColor: string;
  detail: string;
  description: string;
  styles: StyleGroup[];
  albums: ArtistGroup[];
  image: string;
  coverPage: string;
  publishedAt: string;
  expiredAt: string;
  isActive: boolean;
  createdAt: string;
  createdBy: CreatedBy;
  updatedAt: string;
  updatedBy: UpdatedBy;
  videoCount: number;
  totalFollowers: number;
}

export interface ArtistGroup {
  id: string;
  name: string;
}
export interface StyleGroup {
  id: string;
  isActive: boolean;
  name: string;
}

export interface ArtistRequest {
  id: string;
  name: string;
  slug: string;
  codeColor: string;
  detail: string;
  description: string;
  styles: ArtistGroup[];
  albums: ArtistGroup[];
  group: string;
  publishedAt: string;
  expiredAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface ArtistStat {
  totalArtists: number;
  statDate: Date;
  artists: Artist[];
}
