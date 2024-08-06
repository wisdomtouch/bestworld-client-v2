import { CdkFixedSizeVirtualScroll, ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { NavigatorService } from "@app/services/navigators/navigators.service";
import { Permission } from "@app/services/navigators/navigators.type";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { ArtistService } from "@services/artists/artists.service";
import { Artist } from "@services/artists/artists.type";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { Subject, takeUntil } from "rxjs";

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
    NgOptimizedImage,
    ReactiveFormsModule,
    ScrollingModule,
    TablerIconsModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
})
export class DetailComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  accountArtistPermission?: Permission;
  isLoading = true;
  artistDetail?: Artist;
  urlImage = environment.apiUrl + "/images/";
  codeColor?: string;
  artistStyle?: string;

  constructor(
    private _artistService: ArtistService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this._artistService.artistById$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: Artist): void => {
        this.isLoading = false;
        this.artistDetail = value;
        this.codeColor = `${value.codeColor}`;
        this.artistStyle = value.styles[0]!.name; // eslint-disable-line
        this._changeDetectorRef.markForCheck();
      });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountArtistPermission = value.permission.find(
          v => v.menu === PermissionEnum.Artists
        );
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected readonly chipColorConstants = chipColorConstants;
}
