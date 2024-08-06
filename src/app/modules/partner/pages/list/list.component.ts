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

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { DialogImgUrlComponent } from "@app/shared/components/dialog/show-image/dialog-show-image.component";
import { FilterMenuComponent } from "@app/shared/components/filter-menu/filter-menu/filter-menu.component";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { paginationOption } from "@app/shared/constants/pagination.constant";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";
import { FilterMenuData, FilterSearch } from "@app/shared/types/shared.types";

import { NavigatorService } from "@services/navigators/navigators.service";
import { Permission } from "@services/navigators/navigators.type";
import { PartnerService } from "@services/partner/partner.service";
import { PartnerPagination } from "@services/partner/partner.type";

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

  partnerPagination?: PartnerPagination;
  partnerDisplayColumns: string[] = ["no", "name", "createdAt", "updatedAt", "isActive", "action"];
  accountPartnerPermission?: Permission;
  isLoading = true;
  searchInput: FormControl = new FormControl("");
  urlImage = environment.apiUrl + "/images/";
  filter?: FilterSearch;
  filterCount = 0;
  searchGroup: any = []; // eslint-disable-line
  filterMenuData?: FilterMenuData;
  status?: string;

  constructor(
    private _partnerService: PartnerService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef,
    public _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._partnerService.partnerPagination$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.isLoading = false;
        this.partnerPagination = value;
        this._changeDetectorRef.markForCheck();
      });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountPartnerPermission = value.permission.find(
          v => v.menu === PermissionEnum.Partners
        );
      });
    this.filterMenuData = {
      isStatus: true,
      isDate: false,
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
          return this._partnerService.getPartners(
            this._matPaginator.pageIndex,
            this._matPaginator.pageSize,
            this._matSort.active,
            this._matSort.direction,
            this.searchInput.value,
            this.filter?.status
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
      this._partnerService
        .getPartners(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.searchInput.value,
          this.status
        )
        .subscribe();
      this.filterCount = this.searchGroup.length;
    }
  }
  clearChipEvent(value: string[]) {
    this.searchGroup = value;
    this.status = "";
    this._partnerService
      .getPartners(
        this._matPaginator.pageIndex,
        this._matPaginator.pageSize,
        this._matSort.active,
        this._matSort.direction,
        this.searchInput.value,
        this.status ?? ""
      )
      .subscribe();
  }

  clearAllChipEvent() {
    this.filterCount = 0;
    this.searchGroup = [];
    this.status = "";
    this._partnerService
      .getPartners(
        this._matPaginator.pageIndex,
        this._matPaginator.pageSize,
        this._matSort.active,
        this._matSort.direction,
        this.searchInput.value,
        this.status ?? ""
      )
      .subscribe();
  }

  filterCountEvent(value: number) {
    this.filterCount = value;
  }

  onRemoved(index: string) {
    this.searchGroup = this.searchGroup.filter((e: any) => e.type != index);
    /* eslint-disable */
    if (this.searchGroup.filter((e: any) => e.type == "status").length == 0) {
      this.status = "";
    }
    /* eslint-disable */
    this.filterCount--;
    if (this.searchGroup.length == 0) {
      this.status = "";
      this._partnerService
        .getPartners(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.searchInput.value,
          this.status ?? ""
        )
        .subscribe();
    } else {
      this._partnerService
        .getPartners(
          this._matPaginator.pageIndex,
          this._matPaginator.pageSize,
          this._matSort.active,
          this._matSort.direction,
          this.searchInput.value,
          this.status ?? ""
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
