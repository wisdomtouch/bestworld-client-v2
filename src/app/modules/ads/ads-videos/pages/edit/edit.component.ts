import { CommonModule, NgOptimizedImage, formatDate } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { Permission } from "@app/services/navigators/navigators.type";
import { JwplayerComponent } from "@app/shared/components/ads-video/ads-video.component";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { AppDialogComponent } from "@app/shared/components/dialog/dialog.component";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { AdsVideoService } from "@services/adsvideos/ads-videos.service";
import { NavigatorService } from "@services/navigators/navigators.service";

import { ErrorUtils } from "@utils/error.utils";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-edit-ads-video",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    CropImageComponent,
    JwplayerComponent,
    MaterialModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./edit.component.html",
  styleUrl: "./edit.component.scss",
})
export class AdsVideoEditComponent implements OnInit, OnDestroy {
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _changeDetectorRef: ChangeDetectorRef,
    private _adsVideoService: AdsVideoService,
    private _navigatorService: NavigatorService,
    public _dialog: MatDialog,
    private renderer: Renderer2
  ) {}
  private readonly unsubscribe$: Subject<void> = new Subject();
  accountAdsVideoPermission?: Permission;
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  adsVideoFile?: File;
  adsVideoImage?: Blob;
  imageSrc?: string | ArrayBuffer;
  urlImage = environment.apiUrl + "/images/";
  formData = new FormData();
  adsVideoSrc?: string;
  adsVideo?: string;
  isClickVideo = false;
  isClickImage = false;
  @ViewChild("adsVideoContainer", { read: ElementRef }) adsVideoContainer!: ElementRef;

  ngOnInit() {
    this.initForm();
    this._adsVideoService.adsVideoById$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.isLoading = false;
        this.formGroup?.patchValue(value);
        this.imageSrc = this.urlImage + value.image;
        if (value.video) {
          this.adsVideo = value.video;
        }
        this._changeDetectorRef.markForCheck();
      });

    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountAdsVideoPermission = value.permission.find(v => v.menu === PermissionEnum.Ads);
      });
  }
  initForm() {
    this.formGroup = this._formBuilder.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      url: [null, [Validators.required]],
      publishedAt: [null, Validators.required],
      expiredAt: [null, Validators.required],
      fileVideo: [null],
      isActive: [true],
    });
  }
  handleFileInputChangeVideo(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    this.isClickVideo = false;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      if (file.type === "video/mp4" || file.type === "video/mov" || file.type === "video/avi") {
        const fileSizeMB: number = file.size / (1024 * 1024); // Convert file size to MB
        if (fileSizeMB <= 100) {
          this.adsVideoFile = file;
          this.formGroup?.get("fileVideo")?.patchValue(`${file?.name}`);
          const video = document.createElement("video");
          video.src = window.URL.createObjectURL(file);
          video.preload = "metadata";
          this.adsVideoSrc = video.src;
          this.removeVideo();
          this.createVideo();
        } else {
          this._toastr.error("Error", "ไฟล์ต้องที่มีขนาดสูงสุดไม่เกิน 100 MB");
        }
      } else {
        this._toastr.error("Error", "เฉพาะไฟล์ MP4 เท่านั้น");
      }
    }
  }
  createVideo() {
    const videoElement = this.renderer.createElement("video");
    this.renderer.setAttribute(videoElement, "controls", "");
    this.renderer.addClass(videoElement, "w-100");
    const sourceElement = this.renderer.createElement("source");
    this.renderer.setAttribute(sourceElement, "src", this.adsVideoSrc || "");
    this.renderer.setAttribute(sourceElement, "type", "video/mp4");
    this.renderer.appendChild(videoElement, sourceElement);
    this.renderer.appendChild(this.adsVideoContainer?.nativeElement, videoElement);
  }
  removeVideo() {
    const videoElement = this.adsVideoContainer?.nativeElement.querySelector("video");
    if (videoElement) {
      this.renderer.removeChild(this.adsVideoContainer?.nativeElement, videoElement);
    }
  }
  imageAdsVideoProfileEvent(blob: Blob) {
    this.adsVideoImage = blob;
    this.imageSrc = "";
    this.formGroup?.get("adsVideoProfile")?.patchValue(`${blob.type}`);
  }
  submitForm() {
    this.isLoading = true;
    this.isClickVideo = false;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      this.formGroup?.disable();
    }
    this.setFormData();
    this.updateVideo();
  }
  setFormData() {
    this.formData.append("id", this.formGroup?.get("id")?.value);
    this.formData.append("name", this.formGroup?.get("name")?.value);
    this.formData.append("url", this.formGroup?.get("url")?.value);
    this.formData.append("isActive", this.formGroup?.get("isActive")?.value);
    this.formData.append(
      "publishedAt",
      formatDate(this.formGroup?.get("publishedAt")?.value, "yyyy-MM-dd 00:00:00", "en-US")
    );
    this.formData.append(
      "expiredAt",
      formatDate(this.formGroup?.get("expiredAt")?.value, "yyyy-MM-dd 00:00:00", "en-US")
    );
    this.formData.append("fileVideo", this.adsVideoFile ?? "");
    this.formData.append("image", this.adsVideoImage ?? "");
  }
  updateVideo() {
    this._adsVideoService
      .update(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("ads/ads-video/list");
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
    const name = this.formGroup?.get("name")?.value;
    const dialogRef = this._dialog.open(AppDialogComponent);
    dialogRef.componentInstance.tiltle = "ลบข้อมูล";
    dialogRef.componentInstance.subTiltle = `คุณต้องการลบระดับแอดมิน ‘วิดีโอโฆษณา ${name}’ ใช่หรือไม่ ? เมื่อลบแล้วจะไม่สามารถนำกลับมาได้`;
    dialogRef.componentInstance.cancel = "ยกเลิก";
    dialogRef.componentInstance.done = "ยืนยัน";
    dialogRef.afterClosed().subscribe(value => {
      if (value == "OK") {
        this.deleteVideo(id);
      }
    });
  }
  deleteVideo(id: string) {
    this._adsVideoService.delete(id).subscribe({
      next: () => {
        this._toastr.success("Delete", "Delete success");
        this._router.navigateByUrl("/ads-video/list");
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
