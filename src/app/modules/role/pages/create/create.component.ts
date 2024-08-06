import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { PaletteColors } from "@app/shared/enums/role.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { PermissionService } from "@services/permissions/permissions.service";
import { Permissions } from "@services/permissions/permissions.types";
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
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit, OnDestroy {
  permissions!: Permissions[];

  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  private readonly unsubscribe$: Subject<void> = new Subject();
  public paletteColors = PaletteColors;

  constructor(
    private _formBuilder: FormBuilder,
    private _permissionService: PermissionService,
    private _roleService: RoleService,
    private _router: Router,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.initForm();
    this._permissionService.permissions$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.permissions = value;
      this._changeDetectorRef.markForCheck();
    });
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      roleName: [null, [Validators.required]],
      roleColor: ["E81A0C", [Validators.required]],
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
      roleName: this.formGroup?.get("roleName")?.value,
      roleColor: this.formGroup?.get("roleColor")?.value,
      permissions: this.permissions,
    };

    this._roleService
      .createRole(bodyRequest)
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
