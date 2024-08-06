import { CdkFixedSizeVirtualScroll } from "@angular/cdk/scrolling";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { AlbumService } from "@services/albums/albums.service";
import { Album } from "@services/albums/albums.type";
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
    CdkFixedSizeVirtualScroll,
    ChipStatusComponent,
    CommonModule,
    DataNotFoundComponent,
    MaterialModule,
    NgApexchartsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild("chart") chart: ChartComponent = Object.create(null);
  public gredientChartOptions: Partial<ChartOptions> | any; // eslint-disable-line
  private readonly unsubscribe$: Subject<void> = new Subject();
  accountAlbumPermission?: Permission;
  isLoading = true;
  albumDetail?: Album;
  urlImage = environment.apiUrl + "/images/";
  albumStyle?: string;
  isShow = false;
  constructor(
    private _albumService: AlbumService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    //Column chart.
    this.gredientChartOptions = {
      series: [
        {
          name: "Likes",
          data: [4, 3, 10, 9, 35, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5],
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
        width: 7,
        curve: "smooth",
      },

      xaxis: {
        type: "datetime",
        categories: [
          "1/11/2023",
          "2/11/2023",
          "3/11/2023",
          "4/11/2023",
          "5/11/2023",
          "6/11/2023",
          "7/11/2023",
          "8/11/2023",
          "9/11/2023",
          "10/11/2023",
          "11/11/2023",
          "12/11/2023",
          "1/11/2024",
          "2/11/2024",
          "3/11/2024",
          "4/11/2024",
          "5/11/2024",
          "6/11/2024",
        ],
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
        show: false,
      },
    };
  }
  ngOnInit() {
    this._albumService.albumById$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: Album): void => {
        this.isLoading = false;
        this.albumDetail = value;
        this.albumStyle = value.styles[0]!.name; // eslint-disable-line
        this._changeDetectorRef.markForCheck();
      });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountAlbumPermission = value.permission.find(v => v.menu == PermissionEnum.Albums);
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected readonly chipColorConstants = chipColorConstants;
}
