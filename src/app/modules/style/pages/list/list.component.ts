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
import { StylesService } from "@app/services/styles/styles.service";
import { StylePagination } from "@app/services/styles/styles.type";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { FilterMenuComponent } from "@app/shared/components/filter-menu/filter-menu/filter-menu.component";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { paginationOption } from "@app/shared/constants/pagination.constant";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";
import { FilterMenuData, FilterSearch } from "@app/shared/types/shared.types";

import { Permission } from "@services/navigators/navigators.type";

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
  private _unsubscribeAll = new Subject();
  @ViewChild(MatPaginator) _matPaginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort) _matSort: MatSort = Object.create(null);
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  protected readonly paginationOption = paginationOption;
  private readonly unsubscribe$: Subject<void> = new Subject();

  styleDisplayColumns: string[] = [
    "no",
    "name",
    "slug",
    "view",
    "listen",
    "by",
    "updatedAt",
    "byEdit",
    "status",
    "action",
  ];

  stylePagination?: StylePagination;
  accountStylePermission?: Permission;
  isLoading = true;
  searchInput: FormControl = new FormControl("");
  filter?: FilterSearch;
  filterCount = 0;
  searchGroup: any = []; // eslint-disable-line
  filterMenuData?: FilterMenuData;
  dateStart?: string;
  dateEnd?: string;
  status?: string;
  createByInput?: string;
  updateByInput?: string;

  constructor(
    private _stylesService: StylesService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef,
    public _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._stylesService.stylePagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value): void => {
        this.isLoading = false;
        this.stylePagination = value;
        this._changeDetectorRef.markForCheck();
      });

    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountStylePermission = value.permission.find(v => v.menu === PermissionEnum.Styles);
      });
    this.filterMenuData = {
      isStatus: true,
      isDate: true,
      isName: true,
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
          return this._stylesService.getStyle(
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  setFormatDate(value: string) {
    if (value) {
      return formatDate(value, "yyyy-MM-dd 00:00:00", "en-US");
    }
    return value;
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
      this._stylesService
        .getStyle(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.searchInput.value,
          this.status ?? "",
          this.setFormatDate(this.dateStart ?? ""),
          this.setFormatDate(this.dateEnd ?? ""),
          this.createByInput,
          this.updateByInput
        )
        .subscribe();
      this.filterCount = this.searchGroup.length;
    }
  }

  filterCountEvent(value: number) {
    this.filterCount = value;
  }

  statusEvent(value: string) {
    this.filterCount++;
    this.status = value;
    if (this.status) {
      this.filterCount = 0;
      this.filterCount++;
      const data = this.status == "true" ? "สถานะ : เปิดใช้งาน" : "สถานะ : ปิดใช้งาน";
      /* eslint-disable */
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
      this._stylesService
        .getStyle(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.searchInput.value,
          this.status,
          this.setFormatDate(this.dateStart ?? ""),
          this.setFormatDate(this.dateEnd ?? ""),
          this.createByInput,
          this.updateByInput
        )
        .subscribe();
      this.filterCount = this.searchGroup.length;
    }
  }

  createByEvent(value: string) {
    this.filterCount++;
    this.createByInput = value;
    if (this.createByInput) {
      this.filterCount = 0;
      this.filterCount++;
      const data = "สร้างโดย : " + value;
      /* eslint-disable */
      this.searchGroup
        .filter((e: any) => e.type == "createBy")
        .forEach((e: any) => {
          e.value = value;
          e.name = data;
        });
      if (this.searchGroup.filter((e: any) => e.type == "createBy") == 0) {
        this.searchGroup?.push({
          type: "createBy",
          value: value,
          name: data,
        });
      }
      /* eslint-disable */
      merge(this._matSort.sortChange, this._matPaginator.page, this.createByInput)
        .pipe(
          debounceTime(500),
          switchMap(() => {
            this.isLoading = true;
            return this._stylesService.getStyle(
              this._matPaginator.pageIndex,
              this._matPaginator.pageSize,
              this._matSort.active,
              this._matSort.direction,
              "",
              this.status,
              this.setFormatDate(this.dateStart ?? ""),
              this.setFormatDate(this.dateEnd ?? ""),
              this.createByInput,
              this.updateByInput
            );
          }),
          takeUntil(this.unsubscribe$)
        )
        .subscribe();
    }
    this.filterCount = this.searchGroup.length;
  }

  updateByEvent(value: string) {
    this.filterCount++;
    this.updateByInput = value;
    if (this.updateByInput) {
      this.filterCount = 0;
      this.filterCount++;
      const data = "แก้ไขโดย : " + value;
      /* eslint-disable */
      this.searchGroup
        .filter((e: any) => e.type == "updateBy")
        .forEach((e: any) => {
          e.value = value;
          e.name = data;
        });
      if (this.searchGroup.filter((e: any) => e.type == "updateBy") == 0) {
        this.searchGroup?.push({
          type: "updateBy",
          value: value,
          name: data,
        });
      }
      /* eslint-disable */
      merge(this._matSort.sortChange, this._matPaginator.page, this.updateByInput)
        .pipe(
          debounceTime(500),
          switchMap(() => {
            this.isLoading = true;
            return this._stylesService.getStyle(
              this._matPaginator.pageIndex,
              this._matPaginator.pageSize,
              this._matSort.active,
              this._matSort.direction,
              "",
              this.status,
              this.setFormatDate(this.dateStart ?? ""),
              this.setFormatDate(this.dateEnd ?? ""),
              this.createByInput,
              this.updateByInput
            );
          }),
          takeUntil(this.unsubscribe$)
        )
        .subscribe();
    }
    this.filterCount = this.searchGroup.length;
  }

  clearChipEvent(value: string[]) {
    this.searchGroup = value;
    this.dateStart = "";
    this.dateEnd = "";
    this.status = "";
    this.createByInput = "";
    this.updateByInput = "";
    this._stylesService
      .getStyle(
        this._matPaginator.pageIndex,
        this._matPaginator.pageSize,
        this._matSort.active,
        this._matSort.direction,
        this.searchInput.value,
        this.status ?? "",
        this.setFormatDate(this.dateStart ?? ""),
        this.setFormatDate(this.dateEnd ?? ""),
        this.createByInput,
        this.updateByInput
      )
      .subscribe();
  }

  clearAllChipEvent() {
    this.filterCount = 0;
    this.searchGroup = [];
    this.dateStart = "";
    this.dateEnd = "";
    this.status = "";
    this.createByInput = "";
    this.updateByInput = "";
    this._stylesService
      .getStyle(
        this._matPaginator.pageIndex,
        this._matPaginator.pageSize,
        this._matSort.active,
        this._matSort.direction,
        this.searchInput.value,
        this.status ?? "",
        this.setFormatDate(this.dateStart ?? ""),
        this.setFormatDate(this.dateEnd ?? ""),
        this.createByInput,
        this.updateByInput
      )
      .subscribe();
  }

  closeMenu() {
    this.menuTrigger.closeMenu();
  }

  onRemoved(index: string) {
    this.searchGroup = this.searchGroup.filter((e: any) => e.type != index);
    /* eslint-disable */
    if (this.searchGroup.filter((e: any) => e.type == "status").length == 0) {
      this.status = "";
    }
    if (this.searchGroup.filter((e: any) => e.type == "date").length == 0) {
      this.dateStart = "";
      this.dateEnd = "";
    }
    if (this.searchGroup.filter((e: any) => e.type == "createBy").length == 0) {
      this.createByInput = "";
    }
    if (this.searchGroup.filter((e: any) => e.type == "updateBy").length == 0) {
      this.updateByInput = "";
    }
    /* eslint-disable */
    this.filterCount--;
    if (this.searchGroup.length == 0) {
      this.dateStart = "";
      this.dateEnd = "";
      this.status = undefined;
      this._stylesService
        .getStyle(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.searchInput.value,
          this.status ?? "",
          this.setFormatDate(this.dateStart ?? ""),
          this.setFormatDate(this.dateEnd ?? ""),
          this.filter?.createBy,
          this.filter?.updateBy
        )
        .subscribe();
    } else {
      this._stylesService
        .getStyle(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.searchInput.value,
          this.status ?? "",
          this.setFormatDate(this.dateStart ?? ""),
          this.setFormatDate(this.dateEnd ?? ""),
          this.createByInput,
          this.updateByInput
        )
        .subscribe();
    }
  }

  protected readonly chipColorConstants = chipColorConstants;
}
