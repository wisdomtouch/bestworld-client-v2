import { Pagination } from "@app/shared/types/shared.types";

import { Permissions } from "../permissions/permissions.types";

export interface RolesPagination {
  roles: Role[];
  pagination: Pagination;
}

export interface Role {
  id: string;
  roleName: string;
  roleColor: string;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions[];
  permissionsUnused: Permissions[];
}

export interface RoleRequest {
  roleName: string;
  roleColor: string;
  permissions: Permissions[];
}
export interface UpdateRole {
  id: string;
  roleName: string;
  roleColor: string;
}
