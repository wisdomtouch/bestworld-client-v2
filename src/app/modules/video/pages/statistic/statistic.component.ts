import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";

import { NavigatorService } from "@app/services/navigators/navigators.service";
import { Permission } from "@app/services/navigators/navigators.type";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { VideoService } from "@services/videos/videos.service";
import { Video, VideoStat } from "@services/videos/videos.type";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-statistic",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    DataNotFoundComponent,
    MatButtonModule,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./statistic.component.html",
  styleUrl: "./statistic.component.scss",
})
export class StatisticComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  accountVideoPermission?: Permission;
  isLoading = true;
  videoStat?: VideoStat;
  musicVideos?: Video[];
  urlImage = environment.apiUrl + "/images/";
  showClick?: number = 1;
  view?: number;
  currentDate = new Date();
  text?: string;
  datePipe = new DatePipe("en-US");
  constructor(
    private _videoService: VideoService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this._videoService.videoStat$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: VideoStat): void => {
        this.isLoading = false;
        this.videoStat = value;
        this.musicVideos = value.videos;
        this._changeDetectorRef.markForCheck();
      });

    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountVideoPermission = value.permission.find(v => v.menu === PermissionEnum.Videos);
      });

    this.text =
      this.datePipe.transform(this.videoStat?.videoStartDate, "d/MM/yyyy") + " ถึง ปัจจุบัน";
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  onClickShow(val: number) {
    this.showClick = val;
  }
  statByRange(start?: string, end?: string) {
    this._videoService
      .getVideoViewerStat(start, end)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        this.view = value.view;
      });
  }
  getViewerStatAll() {
    const startDate = "";
    const endDate = "";
    this.statByRange(startDate, endDate);
    this.showClick = 1;
    this.text =
      this.datePipe.transform(this.videoStat?.videoStartDate, "d/MM/yyyy") + " ถึง ปัจจุบัน";
  }
  getViewerStatSevenDayAgo() {
    const startDate = new Date(this.currentDate.getTime() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];
    this.statByRange(startDate, endDate);
    this.showClick = 2;
    this.text =
      this.datePipe.transform(startDate, "d/MM/yyyy") +
      " ถึง " +
      this.datePipe.transform(endDate, "d/MM/yyyy");
  }
  getViewerStatThirtyDayAgo() {
    const startDate = new Date(this.currentDate.getTime() - 29 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];
    this.statByRange(startDate, endDate);
    this.showClick = 3;
    this.text =
      this.datePipe.transform(startDate, "d/MM/yyyy") +
      " ถึง " +
      this.datePipe.transform(endDate, "d/MM/yyyy");
  }
  getViewerOnlyThisMonth() {
    const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 2)
      .toISOString()
      .split("T")[0];
    const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
      .toISOString()
      .split("T")[0];
    this.statByRange(startDate, endDate);
    this.showClick = 4;
    this.text =
      this.datePipe.transform(startDate, "d/MM/yyyy") +
      " ถึง " +
      this.datePipe.transform(endDate, "d/MM/yyyy");
  }
}
