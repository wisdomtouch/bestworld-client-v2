export interface ColumnTable {
  columnDef: string;
  header: string;
  width?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  cell: Function;
  isButton?: boolean;
  isLink?: boolean;
  url?: string;
  isStatus?: boolean;
  statusType?: boolean;
  statusTypeTicket?: boolean;
  statusBande?: boolean;
  img?: boolean;
  isSort?: boolean;
  isCover?: boolean;
  isMenu?: boolean;
  isTypeTransaction?: boolean;
  isColor?: boolean;
  isNo?: boolean;
  isVerify?: boolean;
  statusTypeCustomer?: boolean;
  isCheckBox?: boolean;
  isStatusCurrency?: boolean;
  isRole?: boolean;
  isBuying?: boolean;
  isSelling?: boolean;
  isStatusBranch?: boolean;
  isDenom?: boolean;
  isCode?: boolean;
  isLinkCurrency?: boolean;
}
