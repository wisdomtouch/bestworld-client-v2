export interface Option {
  dir: "ltr" | "rtl";
  theme: string;
  sidenavOpened: boolean;
  sidenavCollapsed: boolean;
  boxed: boolean;
  horizontal: boolean;
  activeTheme: string;
  language: string;
  cardBorder: boolean;
  navPos: "side" | "top";
}

export interface ArtistsOption {
  id: string;
  name: string;
  image: string;
  description: string;
  group: string;
}

export interface AlbumsOption {
  id: string;
  name: string;
  image: string;
}

export interface StyleOption {
  id: string;
  name: string;
}

export interface PartnerOption {
  id: string;
  name: string;
}

export interface AdminRoleOption {
  id: string;
  roleName: string;
}
