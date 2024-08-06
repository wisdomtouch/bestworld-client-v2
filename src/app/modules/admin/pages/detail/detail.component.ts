import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { AdminService } from "@services/admin/admin.service";
import { Admin } from "@services/admin/admin.type";
import { NavigatorService } from "@services/navigators/navigators.service";
import { Permission } from "@services/navigators/navigators.type";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-detail",
  standalone: true,
  imports: [
    AlertComponent,
    ChipStatusComponent,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
})
export class DetailComponent implements OnInit {
  constructor(
    private _adminService: AdminService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _navigatorService: NavigatorService
  ) {}

  private readonly unsubscribe$: Subject<void> = new Subject();
  admin?: Admin;
  accountAdminPermission?: Permission;
  urlImage = environment.apiUrl + "/images/";

  ngOnInit(): void {
    this._adminService.adminById$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: Admin): void => {
        this.admin = value;
        this._changeDetectorRef.markForCheck();
      });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountAdminPermission = value.permission.find(v => v.menu === PermissionEnum.Admins);
      });
  }

  protected readonly chipColorConstants = chipColorConstants;
}
