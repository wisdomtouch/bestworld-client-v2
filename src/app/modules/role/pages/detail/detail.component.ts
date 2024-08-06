import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { NavigatorService } from "@services/navigators/navigators.service";
import { Permission } from "@services/navigators/navigators.type";
import { RoleService } from "@services/roles/roles.service";
import { Role } from "@services/roles/roles.types";

import { TablerIconsModule } from "angular-tabler-icons";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-detail",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./detail.component.html",
})
export class DetailComponent implements OnInit {
  private readonly unsubscribe$: Subject<void> = new Subject();
  role?: Role;
  accountRolePermission?: Permission;
  constructor(
    private _roleService: RoleService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _navigatorService: NavigatorService
  ) {}

  ngOnInit() {
    this._roleService.rolesById$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.role = value;
      this._changeDetectorRef.markForCheck();
    });

    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountRolePermission = value.permission.find(v => v.menu === PermissionEnum.Roles);
      });
  }
}
