import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualScrollViewport,
  ScrollingModule,
} from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { NavigatorService } from "@services/navigators/navigators.service";
import { Permission } from "@services/navigators/navigators.type";
import { PartnerService } from "@services/partner/partner.service";
import { Partner } from "@services/partner/partner.type";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-detail",
  standalone: true,
  imports: [
    AlertComponent,
    CdkFixedSizeVirtualScroll,
    CdkVirtualScrollViewport,
    ChipStatusComponent,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ScrollingModule,
    TablerIconsModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
})
export class DetailComponent implements OnInit {
  accountPartnerPermission?: Permission;
  partner?: Partner;
  private readonly unsubscribe$: Subject<void> = new Subject();
  urlImage = environment.apiUrl + "/images/";

  constructor(
    private _partnerService: PartnerService,
    private _navigatorService: NavigatorService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._partnerService.partnerById$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.partner = value;
      this._changeDetectorRef.markForCheck();
    });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountPartnerPermission = value.permission.find(
          v => v.menu === PermissionEnum.Partners
        );
      });
  }

  protected readonly chipColorConstants = chipColorConstants;
}
