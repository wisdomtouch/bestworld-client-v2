export interface Navigators {
  navigators: Navigator[];
  permission: Permission[];
}

export interface Navigator {
  displayName: string;
  iconName: string;
  route: string;
  children: Children[];
}

export interface Children {
  displayName: string;
  iconName: string;
  route: string;
}

export interface Permission {
  menu?: string;
  isGet?: boolean;
  isCreate?: boolean;
  isUpdate?: boolean;
  isDelete?: boolean;
}
