import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { ArtistService } from "@app/services/artists/artists.service";
import { NavigatorService } from "@app/services/navigators/navigators.service";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { Artist, ArtistStat } from "@services/artists/artists.type";
import { Permission } from "@services/navigators/navigators.type";

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
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./statistic.component.html",
  styleUrl: "./statistic.component.scss",
})
export class StatisticComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  accountArtistPermission?: Permission;
  isLoading = true;
  artistStat?: ArtistStat;
  artrists?: Artist[];
  urlImage = environment.apiUrl + "/images/";
  constructor(
    private _artistService: ArtistService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this._artistService.artistStat$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: ArtistStat): void => {
        this.isLoading = false;
        this.artistStat = value;
        this.artrists = value.artists;
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
}
