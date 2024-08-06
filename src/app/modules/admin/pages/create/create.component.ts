import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { MaterialModule } from "@app/shared/modules/material.module";

import { AdminService } from "@services/admin/admin.service";
import { RoleService } from "@services/roles/roles.service";
import { RolesPagination } from "@services/roles/roles.types";

import { ErrorUtils } from "@utils/error.utils";
import { confirmedValidator } from "@utils/utils";

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
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit, OnDestroy {
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _adminService: AdminService,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _roleService: RoleService,
    private _changeDetectorRef: ChangeDetectorRef,
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
  isClickImage = true;
  imageSrc?: string | ArrayBuffer;
  adminProfile?: Blob;

  ngOnInit(): void {
    this.initForm();
    this._roleService.roles$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: RolesPagination): void => {
        this.isLoading = false;
        this.rolesPagination = value;
        this._changeDetectorRef.markForCheck();
      });
  }

  initForm() {
    this.formGroup = this._formBuilder.group(
      {
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
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

  submitForm() {
    this.isLoading = true;
    this.isClickImage = true;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.adminProfile) {
        this.isClickImage = false;
      }
      if (this.rolesPagination && this.rolesPagination.roles.length === 0) {
        this.scrollToFirstInvalidControl();
      }
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
      .createAdmin(this.formData)
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
  private scrollToFirstInvalidControl() {
    if (this.formGroup?.get("email")?.value == null) {
      const firstInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#email");
      firstInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("roleId")?.value == null) {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#addRole");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("password")?.value == null) {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#password");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("confirmPassword")?.value == null) {
      const thirdInvalidControl: HTMLElement =
        this.el?.nativeElement?.querySelector("#confirmPassword");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("firstName")?.value == null) {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#firstName");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("lastName")?.value == null) {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#lastName");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("mobile")?.value == null) {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#mobile");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.adminProfile == null) {
      const el = document.getElementById("adminProfile");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  imageAdminProfileEvent(blob: Blob) {
    this.adminProfile = blob;
    this.formGroup?.get("adminProfile")?.patchValue(`${blob.type}`);
  }
  setFormData() {
    this.formData = new FormData();
    this.formData.append("email", this.formGroup?.get("email")?.value);
    this.formData.append("password", this.formGroup?.get("password")?.value);
    this.formData.append("roleId", this.formGroup?.get("roleId")?.value);
    this.formData.append("firstName", this.formGroup?.get("firstName")?.value);
    this.formData.append("lastName", this.formGroup?.get("lastName")?.value);
    this.formData.append("mobile", this.formGroup?.get("mobile")?.value);
    this.formData.append("address", this.formGroup?.get("address")?.value);
    this.formData.append("adminProfile", this.adminProfile ?? "");
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
