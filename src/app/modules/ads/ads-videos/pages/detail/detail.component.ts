import { CommonModule, formatDate } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { AdsVideoService } from "@app/services/adsvideos/ads-videos.service";
import { JwplayerComponent } from "@app/shared/components/ads-video/ads-video.component";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { AdsVideo, AdsVideoDetailStat } from "@services/adsvideos/ads-videos.type";
import { NavigatorService } from "@services/navigators/navigators.service";
import { Permission } from "@services/navigators/navigators.type";

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
  selector: "app-detail-ads-video",
  standalone: true,
  imports: [
    AlertComponent,
    ChipStatusComponent,
    CommonModule,
    DataNotFoundComponent,
    JwplayerComponent,
    MaterialModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
})
export class AdsVideoDetailComponent implements OnInit, OnDestroy {
  public gredientChartOptions: Partial<ChartOptions> | any; // eslint-disable-line
  private readonly unsubscribe$: Subject<void> = new Subject();
  adsVideoDetailStat!: AdsVideoDetailStat;
  adsVideoDetail?: AdsVideo;
  accountAdsVideoPermission?: Permission;
  urlImage = environment.apiUrl + "/images/";
  isLoading = true;
  streamPath?: string;
  startDate?: string;
  endDate?: string;
  showClick = 1;
  click: Array<number> = [];
  view: Array<number> = [];
  ctr: Array<number> = [];
  date: Array<string> = [];
  id!: string;
  constructor(
    private _adsVideoService: AdsVideoService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.gredientChartOptions = {
      series: [
        {
          name: "View",
          data: [],
        },
        {
          name: "Click",
          data: [],
        },
        {
          name: "CTR (%)",
          type: "column",
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: "line",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        foreColor: "#adb0bb",
        toolbar: {
          show: false,
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
        width: [4, 4, 0],
        curve: "smooth",
      },
      plotOptions: {
        bar: {
          columnWidth: "20%",
        },
      },
      xaxis: {
        type: "line",
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
      yaxis: [
        {
          seriesName: ["View"],
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#adb0bb",
          },
          labels: {
            style: {
              colors: "#adb0bb",
            },
          },
          title: {
            text: "Count(times)",
            style: {
              color: "#adb0bb",
            },
          },
        },
        {
          seriesName: "View",
          show: false,
        },
        {
          seriesName: ["CTR (%)"],
          stepSize: 10,
          min: 0,
          max: 100,
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#adb0bb",
          },
          labels: {
            style: {
              colors: "#adb0bb",
            },
          },
          title: {
            text: "Percent(%)",
            style: {
              color: "#adb0bb",
            },
          },
        },
      ],
      tooltip: {
        theme: "dark",
      },
      grid: {
        show: true,
      },
    };
  }
  ngOnInit(): void {
    this._adsVideoService.adsVideoById$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: AdsVideo): void => {
        this.streamPath = value.video;
        this.isLoading = false;
        this.adsVideoDetail = value;
        this.id = value.id;
        this._changeDetectorRef.markForCheck();
      });
    this._adsVideoService.adsVideoDetailStat$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: AdsVideoDetailStat): void => {
        this.isLoading = false;
        this.adsVideoDetailStat = value;
        value.viewStats.map(e => {
          this.view.push(e.view);
          this.click.push(e.click);
          this.ctr.push(e.ctr);
          this.date.push(formatDate(e.date, "dd-MM-yyyy", "en-US"));
        });
        this.gredientChartOptions.series = [
          {
            name: "View",
            type: "line",
            data: this.view,
          },
          {
            name: "Click",
            type: "line",
            data: this.click,
          },
          {
            name: "CTR (%)",
            type: "column",
            data: this.ctr,
          },
        ];

        this.gredientChartOptions.xaxis = {
          type: "date",
          categories: this.date,
        };
        const maxValueYaxis = Math.max(...this.view);
        const roundedMaxValue = Math.ceil(maxValueYaxis / 10) * 10;
        this.gredientChartOptions.yaxis[0].max = roundedMaxValue;
        this.startDate = "(วันที่เริ่มเผยแพร่วิดีโอเพลง) ";
        this.endDate = "ปัจจุบัน";
        this._changeDetectorRef.markForCheck();
      });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountAdsVideoPermission = value.permission.find(v => v.menu === PermissionEnum.Ads);
      });
  }

  statByRange(startDate?: string, endDate?: string) {
    this._adsVideoService
      .getAdsVideosDetailStatById(this.id, startDate, endDate)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        this.view = [];
        this.date = [];
        this.ctr = [];
        this.click = [];
        this.adsVideoDetailStat = value;
        this.adsVideoDetailStat.viewStats.map(e => {
          this.view.push(e.view);
          this.click.push(e.click);
          this.ctr.push(e.ctr);
          this.date.push(formatDate(e.date, "dd-MM-yyyy", "en-US"));
        });
        this.gredientChartOptions.series = [
          {
            name: "View",
            type: "line",
            data: this.view,
          },
          {
            name: "Click",
            type: "line",
            data: this.click,
          },
          {
            name: "CTR (%)",
            type: "column",
            data: this.ctr,
          },
        ];
        this.gredientChartOptions.xaxis = {
          type: "date",
          categories: this.date,
        };

        const maxValueYaxis = Math.max(...this.view);
        const roundedMaxValue = Math.ceil(maxValueYaxis / 10) * 10;
        this.gredientChartOptions.yaxis[0].max = roundedMaxValue;
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
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected readonly chipColorConstants = chipColorConstants;
}
