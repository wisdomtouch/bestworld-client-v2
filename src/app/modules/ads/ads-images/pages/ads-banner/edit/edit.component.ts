import { CommonModule, NgOptimizedImage, formatDate } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { AdsImagesService } from "@app/services/adsimages/ads-images.service";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { AppDialogComponent } from "@app/shared/components/dialog/dialog.component";
import { DialogPreviewAdsComponent } from "@app/shared/components/dialog/preview-ads-image/dialog-preview-ads/dialog-preview-ads.component";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";
import { ErrorUtils } from "@app/shared/utils/error.utils";

import { AdsImage } from "@services/adsimages/ads-images.type";
import { NavigatorService } from "@services/navigators/navigators.service";
import { Permission } from "@services/navigators/navigators.type";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-edit",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    MaterialModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./edit.component.html",
  styleUrl: "./edit.component.scss",
})
export class AdsBannerEditComponent implements OnInit, OnDestroy {
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _changeDetectorRef: ChangeDetectorRef,
    private _adsImageService: AdsImagesService,
    private _navigatorService: NavigatorService,
    public _dialog: MatDialog
  ) {
    this.urlPage = this._router.url;
  }
  private readonly unsubscribe$: Subject<void> = new Subject();
  accountAdsImagePermission?: Permission;
  adsImageDetail?: AdsImage;
  formGroup?: FormGroup;
  isSubmit = false;
  imageDesktop?: string | ArrayBuffer;
  fileDesktop?: File;
  fileDesktopSize?: string;
  imageMobile?: string | ArrayBuffer;
  fileMobile?: File;
  fileMobileSize?: string;
  isClick?: number;
  isClickDesktop = true;
  isClickMobile = true;
  urlImage = environment.apiUrl + "/images/";
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  formData = new FormData();
  pageParam?: string | null;
  positionParam?: string | null;
  urlPage?: string;

  ngOnInit() {
    this.pageParam = this.urlPage?.split("/")[4];
    this.positionParam = this.urlPage?.split("/")[5];
    this.initForm();
    this._adsImageService.adsImageById$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.adsImageDetail = value;
        this.isLoading = false;
        this.formGroup?.patchValue(value);
        this._changeDetectorRef.markForCheck();
      });

    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountAdsImagePermission = value.permission.find(v => v.menu === PermissionEnum.Ads);
      });
  }
  initForm() {
    this.formGroup = this._formBuilder.group({
      page: [this.pageParam],
      position: [this.positionParam],
      name: [null, Validators.required],
      url: [null, [Validators.required]],
      publishedAt: [null, Validators.required],
      expiredAt: [null, Validators.required],
      imageDesktop: [null, Validators.required],
      imageMobile: [null, Validators.required],
      isActive: [true],
    });
  }
  viewPositionBanner(val: number) {
    this.isClick = val;
  }
  handleFileInputChangeDesktop(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList[0]) {
      const file = fileList[0];
      this.fileDesktopSize = (file.size / (1024 * 1024)).toFixed(2);
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const fileSizeMB: number = file.size / (1024 * 1024); // Convert file size to MB
        if (fileSizeMB <= 1) {
          this.fileDesktop = file;
          this.formGroup?.get("imageDesktop")?.patchValue(`${file?.name}`);
          const reader = new FileReader();
          reader.onload = () => (this.imageDesktop = reader.result ?? "");
          if (file) {
            reader.readAsDataURL(file);
          }
        } else {
          this._toastr.error("Error", "ไฟล์ต้องที่มีขนาดสูงสุดไม่เกิน 1 MB");
        }
      } else {
        this._toastr.error("Error", "เฉพาะไฟล์ JPEG และ PNG เท่านั้น");
      }
    }
  }
  handleFileInputChangeMobile(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList[0]) {
      const file = fileList[0];
      this.fileMobileSize = (file.size / (1024 * 1024)).toFixed(2);
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const fileSizeMB: number = file.size / (1024 * 1024); // Convert file size to MB
        if (fileSizeMB <= 0.5) {
          this.fileMobile = file;
          this.formGroup?.get("imageMobile")?.patchValue(`${file?.name}`);
          const reader = new FileReader();
          reader.onload = () => (this.imageMobile = reader.result ?? "");
          if (file) {
            reader.readAsDataURL(file);
          }
        } else {
          this._toastr.error("Error", "ไฟล์ต้องที่มีขนาดสูงสุดไม่เกิน 500 KB");
        }
      } else {
        this._toastr.error("Error", "เฉพาะไฟล์ JPEG และ PNG เท่านั้น");
      }
    }
  }
  setFormData() {
    this.formData = new FormData();
    this.formData.append("id", this.adsImageDetail?.id ?? "");
    this.formData.append("page", this.pageParam ?? "");
    this.formData.append("position", this.positionParam ?? "");
    this.formData.append("name", this.formGroup?.get("name")?.value);
    this.formData.append("url", this.formGroup?.get("url")?.value);
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
    this.formData.append("imageMobile", this.fileMobile ?? "");
  }
  submitForm() {
    this.isLoading = true;
    this.isClickDesktop = true;
    this.isClickMobile = true;

    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.fileDesktop) {
        this.isClickDesktop = false;
      }
      if (!this.fileMobile) {
        this.isClickMobile = false;
      }
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      this.formGroup?.disable();
    }

    this.setFormData();

    this._adsImageService
      .updateAdsBanner(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl(
            `ads/ads-image/menu/${this.pageParam}/${this.positionParam}/list`
          );
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
  onRoute() {
    return this._router.navigateByUrl(
      `/ads/ads-image/menu/${this.pageParam}/${this.positionParam}/detail/${this.adsImageDetail?.id}`
    );
  }
  zoomImage(url: string | ArrayBuffer, select: number): void {
    this._dialog.open(DialogPreviewAdsComponent, {
      data: {
        url: url,
        position: this.positionParam,
        fileSizeDesktop: this.fileDesktopSize,
        fileSizeMobile: this.fileMobileSize,
        isClick: select,
      },
    });
  }
  openDialogDelete(id?: string): void {
    const name = this.formGroup?.get("name")?.value;
    const dialogRef = this._dialog.open(AppDialogComponent);
    dialogRef.componentInstance.tiltle = "ลบข้อมูล";
    dialogRef.componentInstance.subTiltle = `คุณต้องการลบระดับแอดมิน ‘${name}’ ใช่หรือไม่ ? เมื่อลบแล้วจะไม่สามารถนำกลับมาได้`;
    dialogRef.componentInstance.cancel = "ยกเลิก";
    dialogRef.componentInstance.done = "ยืนยัน";
    dialogRef.afterClosed().subscribe(value => {
      if (value == "OK") {
        this.deleteAdsBanner(id);
      }
    });
  }
  deleteAdsBanner(id: string | undefined) {
    this._adsImageService.delete(id).subscribe({
      next: () => {
        this._toastr.success("Delete", "Delete success");
        this._router.navigateByUrl(
          `/ads/ads-image/menu/${this.pageParam}/${this.positionParam}/list`
        );
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
