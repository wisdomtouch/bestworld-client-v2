import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule, NgOptimizedImage, formatDate } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Video } from "@app/services/videos/videos.type";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { JwplayerComponent } from "@app/shared/components/video/video.component";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { NavigatorService } from "@services/navigators/navigators.service";
import { Permission } from "@services/navigators/navigators.type";
import { VideoService } from "@services/videos/videos.service";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexTheme,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from "ng-apexcharts";
import { Subject, takeUntil } from "rxjs";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any; // eslint-disable-line
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any; // eslint-disable-line
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: "app-detail",
  standalone: true,
  imports: [
    AlertComponent,
    ChipStatusComponent,
    CommonModule,
    DataNotFoundComponent,
    FormsModule,
    JwplayerComponent,
    MaterialModule,
    NgApexchartsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    ScrollingModule,
    TablerIconsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild("chart", { static: false }) chart: ChartComponent | undefined;
  public activeOptionButton = "all";
  public gredientChartOptions: Partial<ChartOptions> | any; // eslint-disable-line
  private readonly unsubscribe$: Subject<void> = new Subject();
  public updateOptionsData = {
    "1m": {
      xaxis: {
        min: new Date("03 Mar 2024").getTime(),
        max: new Date("03 Apr 2024").getTime(),
      },
    },
    "6m": {
      xaxis: {
        min: new Date("03 Mar 2024").getTime(),
        max: new Date("03 Sep 2024").getTime(),
      },
    },
    "1y": {
      xaxis: {
        min: new Date("03 Mar 2024").getTime(),
        max: new Date("03 Feb 2025").getTime(),
      },
    },
    "1yd": {
      xaxis: {
        min: new Date("01 Jan 2024").getTime(),
        max: new Date("03 Mar 2024").getTime(),
      },
    },
    all: {
      xaxis: {
        min: undefined,
        max: undefined,
      },
    },
  };
  accountMusicVideoPermission?: Permission;
  isLoading = true;
  musicDetail?: Video;
  urlImage = environment.apiUrl + "/images/";
  artistName?: string;
  videoStyle?: string;
  steamPath?: string;
  view: Array<number> = [];
  date: Array<number> = [];
  totalView = 0;
  startDate?: string;
  endDate?: string;
  id!: string;
  constructor(
    private _videoService: VideoService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    //Column chart.
    this.gredientChartOptions = {
      series: [
        {
          name: "View",
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: "line",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        foreColor: "#adb0bb",
        toolbar: {
          show: true,
        },
        dropShadow: {
          enabled: true,
          color: "rgba(0,0,0,0.2)",
          top: 12,
          left: 4,
          blur: 3,
          opacity: 0.4,
        },
      },
      stroke: {
        width: 5,
        curve: "smooth",
      },

      xaxis: {
        type: "datetime",
        categories: [],
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#5D87FF"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 0.9,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 4,
        opacity: 0.9,
        colors: ["#5D87FF"],
        strokeColor: "#fff",
        strokeWidth: 2,

        hover: {
          size: 7,
        },
      },
      yaxis: {
        min: 0,
        max: 40,
      },
      tooltip: {
        theme: "dark",
      },
      grid: {
        show: true,
      },
    };
  }
  /* eslint-disable */
  public updateOptions(option: any): void {
    this.activeOptionButton = option;
    switch (this.activeOptionButton) {
      case "1m":
        this.showTimeFrame = 2;
        break;
      case "6m":
        this.showTimeFrame = 3;
        break;
      case "1y":
        this.showTimeFrame = 4;
        break;
      case "1yd":
        this.showTimeFrame = 5;
        break;
      default:
        this.showTimeFrame = 1;
    }
    // @ts-ignore
    this.chart!.updateOptions(this.updateOptionsData[option], false, true, true);
    /* eslint-disable */
  }

  isShow = true;
  showClick = 1;
  showTimeFrame = 1;
  ngOnInit() {
    let currentYear = new Date().getFullYear();
    this._videoService.videoById$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: Video): void => {
        this.isLoading = false;
        this.musicDetail = value;
        this.id = value.id;
        this.steamPath = value.video;
        this.videoStyle = value.styles[0]!.name; // eslint-disable-line
        this.artistName = value.artists[0]!.name; // eslint-disable-line
        this.updateOptionsData["1m"].xaxis.min = new Date(this.musicDetail.publishedAt).getTime();
        this.updateOptionsData["1m"].xaxis.max =
          new Date(this.musicDetail.publishedAt).getTime() + 30 * 24 * 60 * 60 * 1000;
        this.updateOptionsData["6m"].xaxis.min = new Date(this.musicDetail.publishedAt).getTime();
        this.updateOptionsData["6m"].xaxis.max =
          new Date(this.musicDetail.publishedAt).getTime() + 180 * 24 * 60 * 60 * 1000;
        this.updateOptionsData["1y"].xaxis.min = new Date(this.musicDetail.publishedAt).getTime();
        this.updateOptionsData["1y"].xaxis.max =
          new Date(this.musicDetail.publishedAt).getTime() + 365 * 24 * 60 * 60 * 1000;
        this.updateOptionsData["1yd"].xaxis.min = new Date(`01 Jan ${currentYear}`).getTime();
        this.updateOptionsData["1yd"].xaxis.max = new Date().getTime();
        value.viewerStats.map(e => {
          this.view.push(e.view);
          this.date.push(Number(new Date(e.date).getTime()));
        });
        this.totalView = this.view.reduce((acc, cur) => acc + cur, 0);
        this.gredientChartOptions.series = [
          {
            name: "View",
            data: this.view,
          },
        ];
        this.gredientChartOptions.xaxis = {
          type: "datetime",
          categories: this.date,
        };

        const maxValueYaxis = Math.max(...this.view);
        const roundedMaxValue = Math.ceil(maxValueYaxis / 10) * 10;
        this.gredientChartOptions.yaxis.max = roundedMaxValue;
        this.startDate = "(วันที่เริ่มเผยแพร่วิดีโอเพลง) ";
        this.endDate = "ปัจจุบัน";
        this._changeDetectorRef.markForCheck();
      });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountMusicVideoPermission = value.permission.find(
          v => v.menu === PermissionEnum.Videos
        );
      });
  }

  getViewerStatAll() {
    const startDate = "";
    const endDate = "";
    this.statByRange(startDate, endDate);
    this.showClick = 1;
  }

  getViewerStatSevenDayAgo() {
    const startDate = new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];
    this.statByRange(startDate, endDate);
    this.showClick = 2;
  }

  getViewerStatThirtyDayAgo() {
    const startDate = new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];
    this.statByRange(startDate, endDate);
    this.showClick = 3;
  }

  getViewerOnlyThisMonth() {
    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2)
      .toISOString()
      .split("T")[0];
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      .toISOString()
      .split("T")[0];
    this.statByRange(startDate, endDate);
    this.showClick = 4;
  }

  statByRange(startDate?: string, endDate?: string) {
    this.view = [];
    this.date = [];
    this._videoService
      .getVideoViewerStatById(this.id, startDate, endDate)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        value.map(e => {
          this.view.push(e.view);
          this.date.push(Number(new Date(e.date).getTime()));
        });
        this.totalView = this.view.reduce((acc, cur) => acc + cur, 0);
        this.gredientChartOptions.series = [
          {
            name: "View",
            data: this.view,
          },
        ];
        this.gredientChartOptions.xaxis = {
          type: "datetime",
          categories: this.date,
        };
        const maxValueYaxis = Math.max(...this.view);
        const roundedMaxValue = Math.ceil(maxValueYaxis / 10) * 10;
        this.gredientChartOptions.yaxis.max = roundedMaxValue;
        if (startDate && endDate) {
          this.startDate = formatDate(startDate, "d/MM/yyyy", "en-US");
          this.endDate = formatDate(endDate, "d/MM/yyyy", "en-US");
        } else {
          this.startDate = "(วันที่เริ่มเผยแพร่วิดีโอเพลง)";
          this.endDate = "ปัจจุบัน";
        }
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected readonly chipColorConstants = chipColorConstants;
}
