import { CommonModule, NgOptimizedImage, formatDate } from "@angular/common";
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { MaterialModule } from "@app/shared/modules/material.module";

import { AdsVideoService } from "@services/adsvideos/ads-videos.service";

import { ErrorUtils } from "@utils/error.utils";

import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-create-ads-video",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    CropImageComponent,
    MaterialModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./create.component.html",
  styleUrl: "./create.component.scss",
})
export class AdsVideoCreateComponent implements OnInit, OnDestroy {
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _adsVideoService: AdsVideoService,
    private renderer: Renderer2
  ) {}

  private readonly unsubscribe$: Subject<void> = new Subject();
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  adsVideoFile?: File;
  adsVideoImage?: Blob;
  formData = new FormData();
  videoSrc?: string;
  isClickVideo = false;
  isClickImage = false;
  maxDate?: Date;
  nowDate? = new Date();
  @ViewChild("videoContainer", { read: ElementRef }) videoContainer!: ElementRef;
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
      url: [null, Validators.required],
      status: [true, Validators.required],
      dateTimeStart: [null, Validators.required],
      dateTimeEnd: [null, Validators.required],
      file: [null, Validators.required],
      adsVideoProfile: [null, Validators.required],
    });
  }

  handleFileInputChangeVideo(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    this.isClickVideo = false;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      if (file.type === "video/mp4") {
        const fileSizeMB: number = file.size / (1024 * 1024); // Convert file size to MB
        if (fileSizeMB <= 100) {
          this.adsVideoFile = file;
          this.formGroup?.get("file")?.patchValue(`${file?.name}`);
          const video = document.createElement("video");
          video.src = window.URL.createObjectURL(file);
          video.preload = "metadata";
          this.videoSrc = video.src;
          this.removeTagVideo();
          this.createTagVideo();
        } else {
          this._toastr.error("Error", "ไฟล์ต้องที่มีขนาดสูงสุดไม่เกิน 100 MB");
        }
      } else {
        this._toastr.error("Error", "เฉพาะไฟล์ MP4 เท่านั้น");
      }
    }
  }
  removeTagVideo() {
    const videoElement = this.videoContainer?.nativeElement.querySelector("video");
    if (videoElement) {
      this.renderer.removeChild(this.videoContainer?.nativeElement, videoElement);
    }
  }
  createTagVideo() {
    const videoElement = this.renderer.createElement("video");
    this.renderer.setAttribute(videoElement, "controls", "");
    this.renderer.addClass(videoElement, "w-100");
    const sourceElement = this.renderer.createElement("source");
    this.renderer.setAttribute(sourceElement, "src", this.videoSrc || "");
    this.renderer.setAttribute(sourceElement, "type", "video/mp4");
    this.renderer.appendChild(videoElement, sourceElement);
    this.renderer.appendChild(this.videoContainer?.nativeElement, videoElement);
  }

  setFormData() {
    this.formData.append("name", this.formGroup?.get("name")?.value);
    this.formData.append("url", this.formGroup?.get("url")?.value);
    this.formData.append("status", this.formGroup?.get("status")?.value);
    this.formData.append(
      "publishedAt",
      formatDate(this.formGroup?.get("dateTimeStart")?.value, "yyyy-MM-dd hh:mm:ss", "en-US")
    );
    this.formData.append(
      "expiredAt",
      formatDate(this.formGroup?.get("dateTimeEnd")?.value, "yyyy-MM-dd hh:mm:ss", "en-US")
    );
    this.formData.append("fileVideo", this.adsVideoFile ?? "");
    this.formData.append("image", this.adsVideoImage ?? "");
  }

  imageAdsVideoProfileEvent(blob: Blob) {
    this.adsVideoImage = blob;
    this.formGroup?.get("adsVideoProfile")?.patchValue(`${blob.type}`);
  }

  submitForm() {
    this.isLoading = true;
    this.isClickVideo = false;
    this.isClickImage = false;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.videoSrc) {
        this.isClickVideo = true;
      }
      if (!this.adsVideoImage) {
        this.isClickImage = true;
      }
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      this.formGroup?.disable();
    }

    this.setFormData();
    this.createAdsVideo();
  }

  createAdsVideo() {
    this._adsVideoService
      .create(this.formData)
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
