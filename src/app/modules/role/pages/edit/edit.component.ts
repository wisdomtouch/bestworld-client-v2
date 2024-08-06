import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { AppDialogComponent } from "@app/shared/components/dialog/dialog.component";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { PaletteColors } from "@app/shared/enums/role.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { NavigatorService } from "@services/navigators/navigators.service";
import { Permission } from "@services/navigators/navigators.type";
import { PermissionService } from "@services/permissions/permissions.service";
import { Permissions, UpdatePermission } from "@services/permissions/permissions.types";
import { RoleService } from "@services/roles/roles.service";

import { ErrorUtils } from "@utils/error.utils";

import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-create",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit, OnDestroy {
  permissions!: Permissions[];
  roleName?: string;
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  private readonly unsubscribe$: Subject<void> = new Subject();
  public paletteColors = PaletteColors;
  updatePermission?: UpdatePermission;
  accountRolePermission?: Permission;
  constructor(
    private _formBuilder: FormBuilder,
    private _roleService: RoleService,
    private _router: Router,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _changeDetectorRef: ChangeDetectorRef,
    private _permissionService: PermissionService,
    private _navigatorService: NavigatorService,
    public _dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.initForm();

    this._roleService.rolesById$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.isLoading = false;
      this.roleName = value.roleName;
      this.formGroup?.patchValue(value);
      this.permissions = value.permissions.length > 0 ? value.permissions : value.permissionsUnused;
      this._changeDetectorRef.markForCheck();
    });

    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountRolePermission = value.permission.find(v => v.menu === PermissionEnum.Roles);
      });
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      id: [null, Validators.required],
      roleName: [null, [Validators.required]],
      roleColor: [null, [Validators.required]],
    });
  }

  selectPermission(value: MatCheckboxChange, id: string): void {
    this.updatePermission = {
      id: id,
      type: value.source.name ?? "",
      value: value.checked,
    };

    this._permissionService.updatePermission(this.updatePermission).subscribe({
      next: () => {
        this._toastr.success("Success", "บันทึกระดับแอดมินสำเร็จ");
      },
      error: (err: HttpErrorResponse) => {
        this.isShowAlert = true;
        this.alertMessage = this._errorPipe.transform(err.error.message);
      },
    });
  }

  submitForm() {
    this.isLoading = true;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      this.formGroup?.disable();
    }

    const bodyRequest = {
      id: this.formGroup?.get("id")?.value,
      roleName: this.formGroup?.get("roleName")?.value,
      roleColor: this.formGroup?.get("roleColor")?.value,
      permissions: this.permissions,
    };

    this._roleService
      .updateRole(bodyRequest)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/role/list");
        },
        error: err => {
          this._toastr.error("Error", "บันทึกไม่สำเร็จ");
          this.isShowAlert = true;
          this.alertMessage = this._errorPipe.transform(err.error.message);
          this.isLoading = false;
          this.formGroup?.enable();
        },
        complete: () => {
          this.isLoading = false;
          this.formGroup?.enable();
        },
      });
  }

  openDialogDelete(id: string): void {
    const name = this.formGroup?.get("roleName")?.value;
    const dialogRef = this._dialog.open(AppDialogComponent);
    dialogRef.componentInstance.tiltle = "ลบข้อมูล";
    dialogRef.componentInstance.subTiltle = `คุณต้องการลบระดับแอดมิน ‘${name}’ ใช่หรือไม่ ? เมื่อลบแล้วจะไม่สามารถนำกลับมาได้`;
    dialogRef.componentInstance.cancel = "ยกเลิก";
    dialogRef.componentInstance.done = "ยืนยัน";
    dialogRef.afterClosed().subscribe(value => {
      if (value == "OK") {
        this.deleteRole(id);
      }
    });
  }

  deleteRole(id: string) {
    this._roleService.deleteRole(id).subscribe({
      next: () => {
        this._toastr.success("Delete", "Delete success");
        this._router.navigateByUrl("/role/list");
      },
      error: (err: HttpErrorResponse) => {
        const message = this._errorPipe.transform(err.error.message);
        this._toastr.error(message);
      },
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
