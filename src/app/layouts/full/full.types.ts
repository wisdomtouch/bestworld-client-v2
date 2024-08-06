export interface Notification {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

export interface Profile {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

export interface App {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

export interface QuickLink {
  id: number;
  title: string;
  link: string;
}

export interface NavItem {
  displayName?: string;
  disabled?: boolean;
  external?: boolean;
  twoLines?: boolean;
  chip?: boolean;
  iconName?: string;
  navCap?: string;
  chipContent?: string;
  chipClass?: string;
  subtext?: string;
  route?: string;
  children?: NavItem[];
  ddType?: string;
}

export interface Language {
  language: string;
  code: string;
  type?: string;
  icon: string;
}
