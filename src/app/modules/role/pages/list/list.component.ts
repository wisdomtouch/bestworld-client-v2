import { CommonModule, formatDate } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { NavigatorService } from "@app/services/navigators/navigators.service";
import { Permission } from "@app/services/navigators/navigators.type";
import { RoleService } from "@app/services/roles/roles.service";
import { RolesPagination } from "@app/services/roles/roles.types";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { FilterMenuComponent } from "@app/shared/components/filter-menu/filter-menu/filter-menu.component";
import { paginationOption } from "@app/shared/constants/pagination.constant";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";
import { FilterMenuData, FilterSearch } from "@app/shared/types/shared.types";

import { TablerIconsModule } from "angular-tabler-icons";
import { Subject, debounceTime, merge, switchMap, takeUntil } from "rxjs";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    AlertComponent,
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

  roleDisplayColumns: string[] = ["no", "roleName", "createdAt", "updatedAt", "action"];

  rolePagination?: RolesPagination;
  accountRolePermission?: Permission;
  isLoading = true;
  searchInput: FormControl = new FormControl("");
  filter?: FilterSearch;
  filterCount = 0;
  searchGroup: any = []; // eslint-disable-line
  filterMenuData?: FilterMenuData;
  dateStart?: string;
  dateEnd?: string;
  constructor(
    private _roleService: RoleService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _navigatorService: NavigatorService,
    public _dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this._roleService.roles$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.isLoading = false;
      this.rolePagination = value;
      this._changeDetectorRef.markForCheck();
    });

    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountRolePermission = value.permission.find(v => v.menu === PermissionEnum.Roles);
      });
    this.filterMenuData = {
      isStatus: false,
      isDate: true,
      isName: false,
      isRole: false,
      filter: this.filter!, // eslint-disable-line
    };
  }

  ngAfterViewInit(): void {
    merge(this._matSort.sortChange, this._matPaginator.page, this.searchInput.valueChanges)
      .pipe(
        debounceTime(500),
        switchMap(() => {
          this.isLoading = true;
          return this._roleService.getRoles(
            this._matPaginator.pageIndex,
            this._matPaginator.pageSize,
            this._matSort.active,
            this._matSort.direction,
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
      this._roleService
        .getRoles(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.searchInput.value,
          "",
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

  clearChipEvent(value: string[]) {
    this.searchGroup = value;
    this.dateStart = "";
    this.dateEnd = "";
    this._roleService
      .getRoles(
        this._matPaginator.pageIndex,
        this._matPaginator.pageSize,
        this._matSort.active,
        this._matSort.direction,
        this.searchInput.value,
        "",
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
    this._roleService
      .getRoles(
        this._matPaginator.pageIndex,
        this._matPaginator.pageSize,
        this._matSort.active,
        this._matSort.direction,
        this.searchInput.value,
        "",
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
    if (this.searchGroup.filter((e: any) => e.type == "date").length == 0) {
      this.dateStart = "";
      this.dateEnd = "";
    }
    /* eslint-disable */
    this.filterCount--;
    if (this.searchGroup.length == 0) {
      this.dateStart = "";
      this.dateEnd = "";
      this._roleService
        .getRoles(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.searchInput.value,
          "",
          this.setFormatDate(this.dateStart ?? ""),
          this.setFormatDate(this.dateEnd ?? "")
        )
        .subscribe();
    } else {
      this._roleService
        .getRoles(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.searchInput.value,
          "",
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
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
