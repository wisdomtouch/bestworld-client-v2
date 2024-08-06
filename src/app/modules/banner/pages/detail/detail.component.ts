import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { RouterModule } from "@angular/router";

import { Banner, BannerDetail } from "@app/services/banners/banners.type";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { LoadingComponent } from "@app/shared/components/loading/loading.component";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { MaterialModule } from "@app/shared/modules/material.module";

import { BannerService } from "@services/banners/banners.service";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    ChipStatusComponent,
    CommonModule,
    FormsModule,
    LoadingComponent,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    TablerIconsModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent implements OnInit {
  form!: FormGroup;
  banner!: Banner;
  isSubmit = false;
  imageDesktop?: string | ArrayBuffer;
  imageIpad?: string | ArrayBuffer;
  imageMobile?: string | ArrayBuffer;
  showClick?: number = 1;
  urlImage = environment.apiUrl + "/images/";
  isShow = false;

  private _unsubscribeAll = new Subject();

  @ViewChild(MatPaginator) _matPaginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort) _matSort: MatSort = Object.create(null);
  constructor(private _bannerService: BannerService) {}

  bannerColumns: string[] = ["date", "view", "click", "ctr"];
  bannerPagination?: BannerDetail;
  ngOnInit(): void {
    this._bannerService.bannerById$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value): void => {
        this.banner = value;
        this.imageDesktop = value.imageDesktop ? this.urlImage + value.imageDesktop : "";
        this.imageIpad = value.imageIpad ? this.urlImage + value.imageIpad : "";
        this.imageMobile = value.imageMobile ? this.urlImage + value.imageMobile : "";
      });
  }
  onClickShow(val: number) {
    this.showClick = val;
  }

  protected readonly chipColorConstants = chipColorConstants;
}
