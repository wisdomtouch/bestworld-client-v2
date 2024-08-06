import { CreatedBy, Pagination, UpdatedBy } from "@app/shared/types/shared.types";

export interface AdminRequest {
  id?: string;
  email?: string;
  password?: string;
  roleId?: string;
  firstName?: string;
  lastName?: string;
  citizenId?: string;
  mobile?: string;
  address?: string;
  province?: string;
  district?: string;
  subDistrict?: string;
  postCode?: string;
  countryCode?: string;
  isVerify?: boolean;
  role?: Role;
}
export interface AdminPagination {
  admins: Admin[];
  roles: Role[];
  pagination: Pagination;
}

export interface Admin {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  isVerify?: boolean;
  isActive?: boolean;
  citizenId?: string;
  countryCode?: string;
  mobile?: string;
  address?: string;
  province?: string;
  district?: string;
  subDistrict?: string;
  postCode?: string;
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  lastActiveAt?: Date;
  role?: Role;
}

export interface Role {
  id?: string;
  roleColor?: string;
  roleName?: string;
}
