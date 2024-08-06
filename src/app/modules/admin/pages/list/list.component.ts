import { CommonModule, formatDate } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { AdminService } from "@app/services/admin/admin.service";
import { AdminPagination } from "@app/services/admin/admin.type";
import { NavigatorService } from "@app/services/navigators/navigators.service";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { DialogImgUrlComponent } from "@app/shared/components/dialog/show-image/dialog-show-image.component";
import { FilterMenuComponent } from "@app/shared/components/filter-menu/filter-menu/filter-menu.component";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { paginationOption } from "@app/shared/constants/pagination.constant";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";
import {
  FilterMenuData,
  FilterSearch,
  FilterSearchAdminRole,
} from "@app/shared/types/shared.types";

import { Permission } from "@services/navigators/navigators.type";
import { OptionService } from "@services/option/option.service";
import { AdminRoleOption } from "@services/option/option.types";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { Subject, debounceTime, merge, switchMap, takeUntil } from "rxjs";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    AlertComponent,
    ChipStatusComponent,
    CommonModule,
    DataNotFoundComponent,
    FilterMenuComponent,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./list.component.html",
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) _matPaginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort) _matSort: MatSort = Object.create(null);
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  protected readonly paginationOption = paginationOption;
  private readonly unsubscribe$: Subject<void> = new Subject();

  adminPagination?: AdminPagination;
  accountAdminPermission?: Permission;
  adminDisplayColumns: string[] = [
    "no",
    "name",
    "email",
    "mobile",
    "role",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "status",
    "action",
  ];
  formGroup?: FormGroup;
  urlImage = environment.apiUrl + "/images/";
  searchInput: FormControl = new FormControl("");
  isLoading = true;
  filter?: FilterSearch;
  filterSearchRole?: FilterSearchAdminRole;
  adminList?: AdminRoleOption[];
  roleName?: string;
  roleId?: string;
  status?: string;
  dateStart?: string;
  dateEnd?: string;
  filterCount = 0;
  searchGroup: any = []; // eslint-disable-line
  filterMenuData?: FilterMenuData;

  constructor(
    private _adminService: AdminService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _optionService: OptionService,
    public _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._adminService.admin$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: AdminPagination): void => {
        this.isLoading = false;
        this.adminPagination = value;
        this._changeDetectorRef.markForCheck();
      });

    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountAdminPermission = value.permission.find(v => v.menu === PermissionEnum.Admins);
      });
    this._optionService.adminRoleOption$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.adminList = value;
        this._changeDetectorRef.markForCheck();
      });
    this.filterMenuData = {
      isStatus: true,
      isDate: true,
      isRole: true,
      isName: false,
      filter: this.filter!, // eslint-disable-line
    };
  }

  ngAfterViewInit(): void {
    merge(this._matSort.sortChange, this._matPaginator.page, this.searchInput.valueChanges)
      .pipe(
        debounceTime(500),
        switchMap(() => {
          this.isLoading = true;
          return this._adminService.getAdmin(
            this._matPaginator.pageIndex,
            this._matPaginator.pageSize,
            this._matSort.active,
            this._matSort.direction,
            "",
            this.searchInput.value,
            this.filter?.status,
            this.setFormatDate(this.filter?.startDate ?? ""),
            this.setFormatDate(this.filter?.endDate ?? ""),
            this.filter?.createBy,
            this.filter?.updateBy
          );
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  setFormatDate(val: string) {
    if (val) {
      return formatDate(val, "yyyy-MM-dd 00:00:00", "en-US");
    }
    return val;
  }

  setFormatDateItem(value: string) {
    if (value) {
      return formatDate(value, "dd/MM/yy", "en-US");
    }
    return value;
  }

  selectStartDateEvent(value: string) {
    this.dateStart = value;
  }

  selectEndDateEvent(value: string) {
    this.filterCount++;
    this.dateEnd = value;
    if (this.dateStart && this.dateEnd !== null) {
      this.filterCount = 0;
      this.filterCount++;
      const data =
        "ตั้งแต่วันที่ : " +
        this.setFormatDateItem(this.dateStart) +
        "-" +
        this.setFormatDateItem(this.dateEnd);
      /* eslint-disable */
      this.searchGroup
        .filter((e: any) => e.type == "date")
        .forEach((e: any) => {
          e.value = data;
          e.name = data;
        });
      if (this.searchGroup.filter((e: any) => e.type == "date") == 0) {
        this.searchGroup?.push({
          type: "date",
          value: data,
          name: data,
        });
      }
      /* eslint-disable */
      this._adminService
        .getAdmin(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.roleId,
          this.searchInput.value,
          this.status ?? "",
          this.setFormatDate(this.dateStart ?? ""),
          this.setFormatDate(this.dateEnd ?? ""),
          "",
          ""
        )
        .subscribe();
      this.filterCount = this.searchGroup.length;
    }
  }

  filterCountEvent(value: number) {
    this.filterCount = value;
  }

  selectRoleEvent(value: FilterSearchAdminRole) {
    this.filterCount++;
    this.roleId = value.roleId;
    this.roleName = value.roleName;
    if (value) {
      this.filterCount = 0;
      this.filterCount++;
      const data = "ระดับแอดมิน :" + this.roleName;
      this.searchGroup
        .filter((e: any) => e.type == "adminLevel")
        .forEach((e: any) => {
          e.value = value;
          e.name = data;
        });
      if (this.searchGroup.filter((e: any) => e.type == "adminLevel") == 0) {
        this.searchGroup?.push({
          type: "adminLevel",
          value: value,
          name: data,
        });
      }
    }
    this._adminService
      .getAdmin(
        this._matPaginator.pageIndex,
        this._matPaginator.pageSize,
        this._matSort.active,
        this._matSort.direction,
        this.roleId,
        this.searchInput.value,
        this.status,
        this.setFormatDate(this.dateStart ?? ""),
        this.setFormatDate(this.dateEnd ?? ""),
        "",
        ""
      )
      .subscribe();
    this.filterCount = this.searchGroup.length;
  }

  statusEvent(value: string) {
    this.filterCount++;
    this.status = value;
    if (this.status) {
      this.filterCount = 0;
      this.filterCount++;
      const data = this.status == "true" ? "สถานะ : เปิดใช้งาน" : "สถานะ : ปิดใช้งาน";
      this.searchGroup
        .filter((e: any) => e.type == "status")
        .forEach((e: any) => {
          e.value = value;
          e.name = data;
        });
      if (this.searchGroup.filter((e: any) => e.type == "status") == 0) {
        this.searchGroup?.push({
          type: "status",
          value: value,
          name: data,
        });
      }
      /* eslint-disable */
      this._adminService
        .getAdmin(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.roleId,
          this.searchInput.value,
          this.status,
          this.setFormatDate(this.dateStart ?? ""),
          this.setFormatDate(this.dateEnd ?? ""),
          this.filter?.createBy,
          this.filter?.updateBy
        )
        .subscribe();
      this.filterCount = this.searchGroup.length;
    }
  }

  clearChipEvent(value: string[]) {
    this.searchGroup = value;
    this.dateStart = "";
    this.dateEnd = "";
    this.status = "";
    this.roleId = "";
    this._adminService
      .getAdmin(
        this._matPaginator.pageIndex,
        this._matPaginator.pageSize,
        this._matSort.active,
        this._matSort.direction,
        this.roleId ?? "",
        this.searchInput.value,
        this.status ?? "",
        this.setFormatDate(this.dateStart ?? ""),
        this.setFormatDate(this.dateEnd ?? ""),
        "",
        ""
      )
      .subscribe();
  }

  clearAllChipEvent() {
    this.filterCount = 0;
    this.searchGroup = [];
    this.dateStart = "";
    this.dateEnd = "";
    this.status = "";
    this._adminService
      .getAdmin(
        this._matPaginator.pageIndex,
        this._matPaginator.pageSize,
        this._matSort.active,
        this._matSort.direction,
        "",
        this.searchInput.value,
        this.status ?? "",
        this.setFormatDate(this.dateStart ?? ""),
        this.setFormatDate(this.dateEnd ?? ""),
        "",
        ""
      )
      .subscribe();
  }

  onRemoved(index: string) {
    this.searchGroup = this.searchGroup.filter((e: any) => e.type != index);
    /* eslint-disable */
    if (this.searchGroup.filter((e: any) => e.type == "adminLevel").length == 0) {
      this.roleId = "";
    }
    if (this.searchGroup.filter((e: any) => e.type == "status").length == 0) {
      this.status = "";
    }
    if (this.searchGroup.filter((e: any) => e.type == "date").length == 0) {
      this.dateStart = "";
      this.dateEnd = "";
    }
    /* eslint-disable */
    this.filterCount--;
    if (this.searchGroup.length == 0) {
      this.dateStart = "";
      this.dateEnd = "";
      this.status = undefined;
      this.roleId = "";
      this._adminService
        .getAdmin(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.roleId,
          this.searchInput.value,
          this.status ?? "",
          this.setFormatDate(this.dateStart ?? ""),
          this.setFormatDate(this.dateEnd ?? ""),
          "",
          ""
        )
        .subscribe();
    } else {
      this._adminService
        .getAdmin(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.roleId,
          this.searchInput.value,
          this.status ?? "",
          this.setFormatDate(this.dateStart ?? ""),
          this.setFormatDate(this.dateEnd ?? ""),
          "",
          ""
        )
        .subscribe();
    }
  }

  closeMenu() {
    this.menuTrigger.closeMenu();
  }

  zoomImage(url: string): void {
    this._dialog.open(DialogImgUrlComponent, {
      data: {
        url: url,
      },
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected readonly chipColorConstants = chipColorConstants;
}
