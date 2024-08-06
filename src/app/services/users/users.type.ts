export interface UserPagination {
  user: User[];
  pagination: Pagination;
}

export interface User {
  id?: string;
  name?: string;
  googleUsername?: string;
  facebookUsername?: string;
  gender?: string;
  dateOfBirth?: Date;
  image?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Pagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}
