export interface Pagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}

export interface IpLocation {
  city: string;
  ip_address: string;
}
export interface KeyActive {
  name: string;
  key: string;
}
export interface CreatedBy {
  id: string;
  firstname: string;
  lastname: string;
}
export interface UpdatedBy {
  id: string;
  firstname: string;
  lastname: string;
}
export interface ViewerStats {
  view: number;
  statStartDate: Date;
  statEndDate: Date;
  date: Date;
}
export interface viewStats {
  date: Date;
  view: number;
  click: number;
  ctr: number;
}

export interface FilterSearch {
  status: string;
  startDate: string;
  endDate: string;
  createBy: string;
  updateBy: string;
}
export interface FilterSearchAdminRole {
  roleName?: string;
  roleId: string;
}
export interface FilterMenuData {
  isStatus: boolean;
  isDate: boolean;
  isName: boolean;
  isRole: boolean;
  filter: FilterSearch;
}
