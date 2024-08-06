import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { AppDialogComponent } from "@app/shared/components/dialog/dialog.component";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { AdminService } from "@services/admin/admin.service";
import { Admin } from "@services/admin/admin.type";
import { NavigatorService } from "@services/navigators/navigators.service";
import { Permission } from "@services/navigators/navigators.type";
import { RoleService } from "@services/roles/roles.service";
import { RolesPagination } from "@services/roles/roles.types";

import { ErrorUtils } from "@utils/error.utils";
import { confirmedValidator } from "@utils/utils";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-create",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    CropImageComponent,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit, OnDestroy {
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _adminService: AdminService,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _roleService: RoleService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _navigatorService: NavigatorService,
    public _dialog: MatDialog,
    private el: ElementRef
  ) {}

  private readonly unsubscribe$: Subject<void> = new Subject();
  formGroup?: FormGroup;
  formData = new FormData();
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  rolesPagination?: RolesPagination;
  passwordHide = true;
  confirmPasswordHide = true;
  isChange = false;
  accountAdminPermission?: Permission;
  isClickImage = true;
  imageSrc?: string | ArrayBuffer;
  adminProfile?: Blob;
  fileSize?: string;
  urlImage = environment.apiUrl + "/images/";

  ngOnInit(): void {
    this.initForm();
    this._roleService.roles$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: RolesPagination): void => {
        this.isLoading = false;
        this.rolesPagination = value;
        this._changeDetectorRef.markForCheck();
      });
    this._adminService.adminById$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: Admin): void => {
        this.isLoading = false;
        this.formGroup?.patchValue(value);
        this.imageSrc = this.urlImage + value.image;
        this.formGroup?.get("roleId")?.setValue(value.role?.id);
        this.formGroup?.get("adminProfile")?.setValue(value.image);
        this._changeDetectorRef.markForCheck();
      });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountAdminPermission = value.permission.find(v => v.menu === PermissionEnum.Admins);
      });
  }

  initForm() {
    this.formGroup = this._formBuilder.group(
      {
        id: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.minLength(8)]],
        confirmPassword: [null, [Validators.minLength(8)]],
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        mobile: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
        address: [null],
        roleId: [null, [Validators.required]],
        adminProfile: [null, Validators.required],
      },
      {
        validator: confirmedValidator("password", "confirmPassword"),
      }
    );
  }

  changePassword(val: boolean) {
    this.isChange = !val;
    this.clearValidatorsPassword();
    if (!val) {
      this.formGroup?.controls["password"]?.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
      this.formGroup?.controls["confirmPassword"]?.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
      this.formGroup?.controls["password"]?.updateValueAndValidity();
      this.formGroup?.controls["confirmPassword"]?.updateValueAndValidity();
    }
  }

  clearValidatorsPassword() {
    this.formGroup?.controls["password"]?.setValue(null);
    this.formGroup?.controls["confirmPassword"]?.setValue(null);
    this.formGroup?.controls["password"]?.clearValidators();
    this.formGroup?.controls["confirmPassword"]?.clearValidators();
    this.formGroup?.controls["password"]?.updateValueAndValidity();
    this.formGroup?.controls["confirmPassword"]?.updateValueAndValidity();
  }

  imageAdminProfileEvent(blob: Blob) {
    this.adminProfile = blob;
    this.imageSrc = "";
    this.formGroup?.get("adminProfile")?.patchValue(`${blob.type}`);
  }

  submitForm() {
    this.isLoading = true;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      this.scrollToFirstInvalidControl();
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      this.formGroup?.disable();
    }
    this.setFormData();

    this._adminService
      .updateAdmin(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/admin/list");
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
  setFormData() {
    this.formData = new FormData();
    this.formData.append("id", this.formGroup?.get("id")?.value);
    this.formData.append("email", this.formGroup?.get("email")?.value);
    if (this.formGroup?.get("password")?.value) {
      this.formData.append("password", this.formGroup?.get("password")?.value);
    }
    this.formData.append("roleId", this.formGroup?.get("roleId")?.value);
    this.formData.append("firstName", this.formGroup?.get("firstName")?.value);
    this.formData.append("lastName", this.formGroup?.get("lastName")?.value);
    this.formData.append("mobile", this.formGroup?.get("mobile")?.value);
    this.formData.append("address", this.formGroup?.get("address")?.value);
    this.formData.append("adminProfile", this.adminProfile ?? "");
  }

  private scrollToFirstInvalidControl() {
    if (this.formGroup?.get("email")?.value == "") {
      const firstInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#email");
      firstInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("firstName")?.value == "") {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#firstName");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("lastName")?.value == "") {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#lastName");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("mobile")?.value == "") {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#mobile");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.adminProfile == null) {
      const el = document.getElementById("adminProfile");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  openDialogDelect(id: string): void {
    const name = this.formGroup?.get("firstName")?.value;
    const dialogRef = this._dialog.open(AppDialogComponent);
    dialogRef.componentInstance.tiltle = "ลบข้อมูล";
    dialogRef.componentInstance.subTiltle = `คุณต้องการลบผู้ใช้งาน ‘${name}’ ใช่หรือไม่ ? เมื่อลบแล้วจะไม่สามารถนำกลับมาได้`;
    dialogRef.componentInstance.cancel = "ยกเลิก";
    dialogRef.componentInstance.done = "ยืนยัน";
    dialogRef.afterClosed().subscribe(value => {
      if (value == "OK") {
        this.deleteAdmin(id);
      }
    });
  }

  deleteAdmin(id: string) {
    this._adminService.deleteAdmin(id).subscribe({
      next: () => {
        this._toastr.success("Delete", "Delete success");
        this._router.navigateByUrl("/admin/list");
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
