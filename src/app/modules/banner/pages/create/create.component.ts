import { CommonModule, formatDate } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { Banner } from "@app/services/banners/banners.type";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { MaterialModule } from "@app/shared/modules/material.module";
import { ErrorUtils } from "@app/shared/utils/error.utils";

import { BannerService } from "@services/banners/banners.service";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-list",
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
  formGroup?: FormGroup;
  banner?: Banner;
  isSubmit = false;
  fileSize?: string;
  imageDesktop?: string | ArrayBuffer;
  fileDesktop?: Blob;
  imageIpad?: string | ArrayBuffer;
  fileIpad?: Blob;
  imageMobile?: string | ArrayBuffer;
  fileMobile?: Blob;
  isClick?: number;
  isClickDesktop = true;
  isClickIpad = true;
  isClickMobile = true;
  urlImage = environment.apiUrl + "/images/";
  private readonly unsubscribe$: Subject<void> = new Subject();
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  formData = new FormData();
  maxDate?: Date;
  constructor(
    private _formBuilder: FormBuilder,
    private _bannerService: BannerService,
    private _router: Router,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils
  ) {}

  ngOnInit(): void {
    this.initForm();
    const date = new Date();
    date.setFullYear(date.getFullYear() + 13);
    formatDate(date, "mm/dd/yyyy", "en-US");
    this.maxDate = date;
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      name: [null, Validators.required],
      link: [null, [Validators.required]],
      order: [null, [Validators.required]],
      publishedAt: [null, Validators.required],
      expiredAt: [null, Validators.required],
      imageDesktop: [null, Validators.required],
      imageIpad: [null, Validators.required],
      imageMobile: [null, Validators.required],
      isActive: [true],
    });
  }

  viewPositionBanner(val: number) {
    this.isClick = val;
  }
  imageBannerDesktopEvent(blob: Blob) {
    this.fileDesktop = blob;
    this.formGroup?.get("imageDesktop")?.patchValue(`${blob.type}`);
  }
  imageBannerIpadEvent(blob: Blob) {
    this.fileIpad = blob;
    this.formGroup?.get("imageIpad")?.patchValue(`${blob.type}`);
  }
  imageBannerMobileEvent(blob: Blob) {
    this.fileMobile = blob;
    this.formGroup?.get("imageMobile")?.patchValue(`${blob.type}`);
  }

  submitForm() {
    console.log(this.formGroup?.value);
    this.isSubmit = true;
    this.isClickDesktop = true;
    this.isClickIpad = true;
    this.isClickMobile = true;
    if (this.formGroup?.invalid) {
      this.isSubmit = false;

      if (!this.fileDesktop) {
        this.isClickDesktop = false;
      }
      if (!this.fileIpad) {
        this.isClickIpad = false;
      }
      if (!this.fileMobile) {
        this.isClickMobile = false;
      }

      for (const control of Object.keys(this.formGroup.controls)) {
        this.formGroup.controls[control]?.markAsTouched();
      }

      return;
    } else {
      this.formGroup?.disable();
    }

    this.setFormData();

    this._bannerService
      .createBanner(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/banner/list");
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
    this.formData.append("name", this.formGroup?.get("name")?.value);
    this.formData.append("link", this.formGroup?.get("link")?.value);
    this.formData.append("order", this.formGroup?.get("order")?.value);
    this.formData.append(
      "expiredAt",
      formatDate(this.formGroup?.get("expiredAt")?.value, "yyyy-MM-dd hh:mm:ss", "en-US")
    );
    this.formData.append(
      "publishedAt",
      formatDate(this.formGroup?.get("publishedAt")?.value, "yyyy-MM-dd hh:mm:ss", "en-US")
    );
    this.formData.append("isActive", this.formGroup?.get("isActive")?.value);
    this.formData.append("imageDesktop", this.fileDesktop ?? "");
    this.formData.append("imageIpad", this.fileIpad ?? "");
    this.formData.append("imageMobile", this.fileMobile ?? "");
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
