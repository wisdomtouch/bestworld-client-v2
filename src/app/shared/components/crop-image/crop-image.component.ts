import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";

import { MaterialModule } from "@app/shared/modules/material.module";

import { ToastrService } from "ngx-toastr";
import { filter } from "rxjs";

import {
  CropperDialogResult,
  ShowCropImageComponent,
} from "../dialog/show-crop-image/show-crop-image.component";

@Component({
  selector: "app-crop-image",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MaterialModule],
  templateUrl: "./crop-image.component.html",
  styleUrl: "./crop-image.component.scss",
})
export class CropImageComponent {
  constructor(private _toastr: ToastrService) {
    effect(() => {
      if (this.croppedImageArtistProfile()) {
        this.imageArtistProfileReady.emit(this.croppedImageArtistProfile()?.blob);
      }
      if (this.croppedImageArtistCover()) {
        this.imageArtistCoverReady.emit(this.croppedImageArtistCover()?.blob);
      }
      if (this.croppedImageAlbumThumbnail()) {
        this.imageAlbumThumbnailReady.emit(this.croppedImageAlbumThumbnail()?.blob);
      }
      if (this.croppedImageAlbumCover()) {
        this.imageAlbumCoverReady.emit(this.croppedImageAlbumCover()?.blob);
      }
      if (this.croppedImageVideoThumbnail()) {
        this.imageVideoThumbnailReady.emit(this.croppedImageVideoThumbnail()?.blob);
      }
      if (this.croppedImageBannerDesktop()) {
        this.imageBannerDesktopReady.emit(this.croppedImageBannerDesktop()?.blob);
      }
      if (this.croppedImageBannerIpad()) {
        this.imageBannerIpadReady.emit(this.croppedImageBannerIpad()?.blob);
      }
      if (this.croppedImageBannerMobile()) {
        this.imageBannerMobileReady.emit(this.croppedImageBannerMobile()?.blob);
      }
      if (this.croppedImagePlayListThumbnail()) {
        this.imagePlayListThumbnailReady.emit(this.croppedImagePlayListThumbnail()?.blob);
      }
      if (this.croppedImagePlayListCover()) {
        this.imagePlayListCoverReady.emit(this.croppedImagePlayListCover()?.blob);
      }
      if (this.croppedImageAdsVideoProfile()) {
        this.imageAdsVideoProfileReady.emit(this.croppedImageAdsVideoProfile()?.blob);
      }
      if (this.croppedImageAdminProfile()) {
        this.imageAdminProfileReady.emit(this.croppedImageAdminProfile()?.blob);
      }
      if (this.croppedImagePartnerProfile()) {
        this.imagePartnerProfileReady.emit(this.croppedImagePartnerProfile()?.blob);
      }
    });
  }
  fileSize?: string;
  imageWidth = signal(0);
  keyImage = signal("");
  imgSrc: WritableSignal<any> = signal(""); // eslint-disable-line
  @Input({ required: true }) set width(val: number) {
    this.imageWidth.set(val);
  }
  imageHeight = signal(0);
  @Input({ required: true }) set height(val: number) {
    this.imageHeight.set(val);
  }
  @Input({ required: true }) set key(val: string) {
    this.keyImage.set(val);
  }
  @Input() set imgSrcOld(val: string | ArrayBuffer | undefined) {
    this.imgSrc.set(val);
  }

  @Output() imageArtistProfileReady = new EventEmitter<Blob>();
  @Output() imageArtistCoverReady = new EventEmitter<Blob>();
  @Output() imageAlbumThumbnailReady = new EventEmitter<Blob>();
  @Output() imageAlbumCoverReady = new EventEmitter<Blob>();
  @Output() imageVideoThumbnailReady = new EventEmitter<Blob>();
  @Output() imageBannerDesktopReady = new EventEmitter<Blob>();
  @Output() imageBannerIpadReady = new EventEmitter<Blob>();
  @Output() imageBannerMobileReady = new EventEmitter<Blob>();
  @Output() imagePlayListThumbnailReady = new EventEmitter<Blob>();
  @Output() imagePlayListCoverReady = new EventEmitter<Blob>();
  @Output() imageAdsVideoProfileReady = new EventEmitter<Blob>();
  @Output() imageAdminProfileReady = new EventEmitter<Blob>();
  @Output() imagePartnerProfileReady = new EventEmitter<Blob>();

  placeholder = computed(
    () => `https://placehold.co/${this.imageWidth()}X${this.imageHeight()}/e8f7ff/7c8fac`
  );
  croppedImageArtistProfile = signal<CropperDialogResult | undefined>(undefined);
  croppedImageArtistCover = signal<CropperDialogResult | undefined>(undefined);
  croppedImageAlbumThumbnail = signal<CropperDialogResult | undefined>(undefined);
  croppedImageAlbumCover = signal<CropperDialogResult | undefined>(undefined);
  croppedImageVideoThumbnail = signal<CropperDialogResult | undefined>(undefined);
  croppedImageBannerDesktop = signal<CropperDialogResult | undefined>(undefined);
  croppedImageBannerIpad = signal<CropperDialogResult | undefined>(undefined);
  croppedImageBannerMobile = signal<CropperDialogResult | undefined>(undefined);
  croppedImagePlayListThumbnail = signal<CropperDialogResult | undefined>(undefined);
  croppedImagePlayListCover = signal<CropperDialogResult | undefined>(undefined);
  croppedImageAdsVideoProfile = signal<CropperDialogResult | undefined>(undefined);
  croppedImageAdminProfile = signal<CropperDialogResult | undefined>(undefined);
  croppedImagePartnerProfile = signal<CropperDialogResult | undefined>(undefined);

  imageSource = computed(() => {
    if (this.croppedImageArtistProfile()) {
      return this.croppedImageArtistProfile()?.imageUrl;
    }
    if (this.croppedImageArtistCover()) {
      return this.croppedImageArtistCover()?.imageUrl;
    }
    if (this.croppedImageAlbumThumbnail()) {
      return this.croppedImageAlbumThumbnail()?.imageUrl;
    }
    if (this.croppedImageAlbumCover()) {
      return this.croppedImageAlbumCover()?.imageUrl;
    }
    if (this.croppedImageVideoThumbnail()) {
      return this.croppedImageVideoThumbnail()?.imageUrl;
    }
    if (this.croppedImageBannerDesktop()) {
      return this.croppedImageBannerDesktop()?.imageUrl;
    }
    if (this.croppedImageBannerIpad()) {
      return this.croppedImageBannerIpad()?.imageUrl;
    }
    if (this.croppedImageBannerMobile()) {
      return this.croppedImageBannerMobile()?.imageUrl;
    }
    if (this.croppedImagePlayListThumbnail()) {
      return this.croppedImagePlayListThumbnail()?.imageUrl;
    }
    if (this.croppedImagePlayListCover()) {
      return this.croppedImagePlayListCover()?.imageUrl;
    }
    if (this.croppedImageAdsVideoProfile()) {
      return this.croppedImageAdsVideoProfile()?.imageUrl;
    }
    if (this.croppedImageAdminProfile()) {
      return this.croppedImageAdminProfile()?.imageUrl;
    }
    if (this.croppedImagePartnerProfile()) {
      return this.croppedImagePartnerProfile()?.imageUrl;
    }
    return this.placeholder();
  });
  dialog = inject(MatDialog);

  /* eslint-disable */
  fileSelected(event: any, key: string) {
    const file = event.target?.files[0];
    if (file) {
      this.fileSize = (file.size / (1024 * 1024)).toFixed(2);
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const fileSizeMB: number = file.size / (1024 * 1024); // Convert file size to MB
        if (fileSizeMB <= 0.5) {
          const dialogRef = this.dialog.open(ShowCropImageComponent, {
            data: {
              image: file,
              width: this.imageWidth(),
              height: this.imageHeight(),
            },
            width: "500px",
          });
          dialogRef.disableClose = true;
          if (key == "artistProfile") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImageArtistProfile.set(result);
              });
          }
          if (key == "artistCover") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImageArtistCover.set(result);
              });
          }
          if (key == "albumThumbnail") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImageAlbumThumbnail.set(result);
              });
          }
          if (key == "albumCover") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImageAlbumCover.set(result);
              });
          }
          if (key == "videoThumbnail") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImageVideoThumbnail.set(result);
              });
          }
          if (key == "imageDesktop") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImageBannerDesktop.set(result);
              });
          }
          if (key == "imageIpad") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImageBannerIpad.set(result);
              });
          }
          if (key == "imageMobile") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImageBannerMobile.set(result);
              });
          }
          if (key == "playlistThumbnail") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImagePlayListThumbnail.set(result);
              });
          }
          if (key == "playlistCover") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImagePlayListCover.set(result);
              });
          }
          if (key == "adsVideoProfile") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImageAdsVideoProfile.set(result);
              });
          }
          if (key == "adminProfile") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImageAdminProfile.set(result);
              });
          }
          if (key == "partnerProfile") {
            dialogRef
              .afterClosed()
              .pipe(filter(result => !!result))
              .subscribe((result: CropperDialogResult) => {
                this.croppedImagePartnerProfile.set(result);
              });
          }
        } else {
          this._toastr.error("Error", "ไฟล์ต้องที่มีขนาดสูงสุดไม่เกิน 500 KB");
        }
      } else {
        this._toastr.error("Error", "เฉพาะไฟล์ JPEG และ PNG เท่านั้น");
      }
    }
  }
  /* eslint-disable */
}
