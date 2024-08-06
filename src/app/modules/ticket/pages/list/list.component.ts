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
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { DialogImgUrlComponent } from "@app/shared/components/dialog/show-image/dialog-show-image.component";
import { FilterMenuComponent } from "@app/shared/components/filter-menu/filter-menu/filter-menu.component";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { paginationOption } from "@app/shared/constants/pagination.constant";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { TicketStatus } from "@app/shared/enums/ticket.emum";
import { MaterialModule } from "@app/shared/modules/material.module";
import { FilterMenuData, FilterSearch } from "@app/shared/types/shared.types";

import { TicketService } from "@services/ticket/ticket.service";
import { TicketPagination } from "@services/ticket/ticket.type";

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
  protected readonly TicketStatus = TicketStatus;

  ticketPagination?: TicketPagination;
  ticketDisplayColumns: string[] = [
    "title",
    "partner",
    "createdBy",
    "createdAt",
    "status",
    "action",
  ];
  accountTicketPermission?: Permission;
  isLoading = true;
  searchInput: FormControl = new FormControl("");
  urlImage = environment.apiUrl + "/images/";
  filter?: FilterSearch;
  filterCount = 0;
  searchGroup: any = []; // eslint-disable-line
  filterMenuData?: FilterMenuData;
  dateStart?: string;
  dateEnd?: string;

  constructor(
    private _ticketService: TicketService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef,
    public _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._ticketService.ticket$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: TicketPagination): void => {
        this.isLoading = false;
        this.ticketPagination = value;
        this._changeDetectorRef.markForCheck();
      });

    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountTicketPermission = value.permission.find(
          v => v.menu === PermissionEnum.TicketRequests
        );
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
          return this._ticketService.getTicket(
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

  zoomImage(url: string): void {
    this._dialog.open(DialogImgUrlComponent, {
      data: {
        url: url,
      },
    });
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
      this._ticketService
        .getTicket(
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
    this._ticketService
      .getTicket(
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
    this._ticketService
      .getTicket(
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

  closeMenu() {
    this.menuTrigger.closeMenu();
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
      this._ticketService
        .getTicket(
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
    } else {
      this._ticketService
        .getTicket(
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected readonly chipColorConstants = chipColorConstants;
}
