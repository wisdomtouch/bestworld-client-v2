export interface PermissionsPagination {
  permissions: Permissions[];
}

export interface Permissions {
  id: string;
  menuName: number;
  isGet: string;
  isCreate: string;
  isUpdate: Date;
  isDelete: Date;
}

export interface UpdatePermission {
  id: string;
  type: string;
  value: boolean;
}
