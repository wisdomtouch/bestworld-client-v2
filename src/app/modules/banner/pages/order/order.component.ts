import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";

import { BannerService } from "@app/services/banners/banners.service";
import { Banner, BannerPagination } from "@app/services/banners/banners.type";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { DialogImgUrlComponent } from "@app/shared/components/dialog/show-image/dialog-show-image.component";
import { TableComponent } from "@app/shared/components/table/table.component";
import { paginationOption } from "@app/shared/constants/pagination.constant";

import { ErrorUtils } from "@utils/error.utils";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    DataNotFoundComponent,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgForOf,
    NgIf,
    RouterModule,
    TableComponent,
    TablerIconsModule,
  ],
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent implements OnInit {
  @ViewChild(MatPaginator) _matPaginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort) _matSort: MatSort = Object.create(null);
  protected readonly paginationOption = paginationOption;
  private readonly unsubscribe$: Subject<void> = new Subject();

  bannerDisplayColumns: string[] = ["no", "order", "name", "status", "start-end", "action"];
  bannerPagination?: BannerPagination;
  isLoading = true;

  dragDisabled = true;

  banner!: Banner;
  order!: string;

  urlImage = environment.apiUrl + "/images/";

  constructor(
    private _bannerService: BannerService,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _changeDetectorRef: ChangeDetectorRef,
    public _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._bannerService.bannerPagination$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.isLoading = false;
        this.bannerPagination = value;
        this._changeDetectorRef.markForCheck();
      });
  }

  drop(event: CdkDragDrop<Banner[]>) {
    this.dragDisabled = true;
    if (event.previousContainer === event.container) {
      const data = event.container.data[event.previousIndex];
      const order = event.currentIndex + 1;

      if (data) this.moveData(data, order);

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  moveData(data: Banner, order: number) {
    this.banner = data;
    this.order = order.toString();
    this.onSubmit();
  }

  zoomImage(url: string): void {
    this._dialog.open(DialogImgUrlComponent, {
      data: {
        url: url,
      },
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append("id", this.banner.id);
    formData.append("name", this.banner.name);
    formData.append("link", this.banner.link);
    formData.append("order", this.order);

    this._bannerService
      .updateBanner(formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._bannerService.getBanner().subscribe();
          this._toastr.success("Success", "Move success");
        },
        error: err => {
          const message = this._errorPipe.transform(err.error.message);
          this._toastr.error(message);
        },
      });
  }
}
