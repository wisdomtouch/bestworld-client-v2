import { CommonModule, formatDate } from "@angular/common";
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
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { AppDialogComponent } from "@app/shared/components/dialog/dialog.component";
import { DialogShowArtistsComponent } from "@app/shared/components/dialog/show-artist/show-artists/show-artist.component";
import { DialogStyleComponent } from "@app/shared/components/dialog/show-style/show-style.component";
import { JwplayerComponent } from "@app/shared/components/video/video.component";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { CkUploadAdapter } from "@services/ck-upload.service";
import { NavigatorService } from "@services/navigators/navigators.service";
import { OptionService } from "@services/option/option.service";
import {
  AlbumsOption,
  ArtistsOption,
  PartnerOption,
  StyleOption,
} from "@services/option/option.types";
import { VideoService } from "@services/videos/videos.service";
import { LalalaiResp } from "@services/videos/videos.type";

import { ErrorUtils } from "@utils/error.utils";
import { generateRandomString, slugValidator } from "@utils/utils";

import { environment } from "@environments/environment";

import { CKEditorComponent, CKEditorModule } from "@ckeditor/ckeditor5-angular";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";
import { uid } from "uid";

@Component({
  selector: "app-create",
  standalone: true,
  imports: [
    AlertComponent,
    CKEditorModule,
    CommonModule,
    CropImageComponent,
    JwplayerComponent,
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
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _optionService: OptionService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _videoService: VideoService,
    private _navigatorService: NavigatorService,
    public _dialog: MatDialog,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  EditorLyrics = DecoupledEditor;
  EditorDescription = DecoupledEditor;
  public editorConfig = {
    enterMode: "br",
    link: { addTargetToExternalLinks: true },
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "fontfamily",
        "fontsize",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "strikethrough",
        "subscript",
        "superscript",
        "code",
        "|",
        "blockQuote",
        "codeBlock",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
    },
  };
  private readonly unsubscribe$: Subject<void> = new Subject();
  @ViewChild("editorLyric") editorLyric: CKEditorComponent | undefined;
  @ViewChild("editorDescription") editorDescription: CKEditorComponent | undefined;
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  styleList?: StyleOption[];
  artistList?: ArtistsOption[];
  partnerList?: PartnerOption[];
  albumsList?: AlbumsOption[];
  videoThumbnail?: Blob;
  imageSrc?: string | ArrayBuffer;
  isClickImage = false;
  videoFile?: File;
  vocalRemoverResp!: LalalaiResp;
  videoDuration?: number;
  formData = new FormData();
  formSplit = new FormData();
  urlImage = environment.apiUrl + "/images/";
  lyrics?: string;
  lyricsEdit!: string;
  description?: string;
  descriptionEdit!: string;
  uid = uid(32);
  isLyrics = false;
  isDescriptions = false;
  videoSrc?: string;
  video?: string;
  isClickVideo = false;
  status?: string;
  accountVideoPermission?: Permission;
  styleArray: Array<string> = [];
  styleName?: Array<string> = [];
  artistId?: Array<string> = [];
  artistName?: Array<string> = [];
  @ViewChild("videoContainer", { read: ElementRef }) videoContainer!: ElementRef;
  maxDate?: Date;
  isArtist = false;
  isStyle = false;
  ngOnInit(): void {
    this.initForm();
    this._optionService.styleOption$.pipe(takeUntil(this.unsubscribe$)).subscribe((value): void => {
      this.styleList = value;
      this._changeDetectorRef.markForCheck();
    });
    this._optionService.artistOption$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.artistList = value;
        this._changeDetectorRef.markForCheck();
      });

    this._videoService.videoById$.pipe(takeUntil(this.unsubscribe$)).subscribe((value): void => {
      this.isLoading = false;
      this.formGroup?.patchValue(value);
      value.styles.map(e => {
        this.styleArray?.push(e.id);
        this.styleName?.push(e.name);
      });
      value.artists.map(e => {
        this.artistId?.push(e.id);
        this.artistName?.push(e.name);
      });
      this.formGroup?.get("styleIds")?.setValue(this.styleName);
      this.lyricsEdit = value.lyrics ?? "";
      this.lyrics = value.lyrics ?? "";
      this.descriptionEdit = value.description ?? "";
      this.description = value.description ?? "";
      this.formGroup?.get("artists")?.setValue(this.artistName);
      this.formGroup?.get("videoThumbnail")?.setValue(value.image);
      this.formGroup?.get("partner")?.setValue(value.partner.id);
      this.imageSrc = this.urlImage + value.image;
      if (value.video) {
        this.video = value.video;
      }
      this.status = value.status;
      this._changeDetectorRef.markForCheck();
    });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountVideoPermission = value.permission.find(v => v.menu === PermissionEnum.Videos);
      });
    this._optionService.partnerOption$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.partnerList = value;
        this._changeDetectorRef.markForCheck();
      });
    const date = new Date();
    date.setFullYear(date.getFullYear() + 13);
    formatDate(date, "mm/dd/yyyy", "en-US");
    this.maxDate = date;
  }
  initForm() {
    this.formGroup = this._formBuilder.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      slug: [null, [slugValidator()]],
      styleIds: [{ value: null, disabled: true }, Validators.required],
      artists: [{ value: null, disabled: true }, Validators.required],
      videoThumbnail: [null, Validators.required],
      video: [null, Validators.required],
      partner: [null, Validators.required],
      status: [null, Validators.required],
      isActive: [true],
    });
  }

  openDialogStyle(): void {
    const dialogRef = this._dialog.open(DialogStyleComponent, {
      data: {
        styleOption: this.styleList ?? [],
        styleName: this.styleName,
        styleId: this.styleArray,
      },
      width: "500px",
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.styleArray = value.styleId;
        this.styleName = value.styleName;
        this.formGroup?.get("styleIds")?.setValue(value.styleName);
        this.isStyle = false;
      }
    });
  }

  openDialogArtist(): void {
    const dialogRef = this._dialog.open(DialogShowArtistsComponent, {
      data: {
        artistOption: this.artistList ?? [],
        artistName: this.artistName,
        artistId: this.artistId,
      },
      width: "500px",
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.artistId = value.artistId;
        this.artistName = value.artistName;
        this.formGroup?.get("artists")?.setValue(value.artistName);
        this.isArtist = false;
      }
    });
  }

  /* eslint-disable */
  public onReadyLyric(editor: any): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return new CkUploadAdapter(loader, "blog", this.uid);
    };
  }
  public onReadyDescription(editor: any): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return new CkUploadAdapter(loader, "blog", this.uid);
    };
  }

  /* eslint-disable */
  public onChangeLyric(editor: any) {
    this.lyrics = editor.editor?.getData();
    if (this.lyrics == "") {
      this.isLyrics = true;
    }
    this.isLyrics = false;
  }
  public onChangeDescription(editor: any) {
    this.description = editor.editor?.getData();
    if (this.description == "") {
      this.isDescriptions = true;
    }
    this.isDescriptions = false;
  }

  imageVideoThumbnailEvent(blob: Blob) {
    this.videoThumbnail = blob;
    this.imageSrc = "";
    this.formGroup?.get("videoThumbnail")?.patchValue(`${blob.type}`);
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
          this.videoFile = file;
          this.formGroup?.get("video")?.patchValue(`${file?.name}`);
          const video = document.createElement("video");
          video.src = window.URL.createObjectURL(file);
          video.preload = "metadata";
          video.onloadedmetadata = () => {
            this.videoDuration = video.duration;
          };
          this.videoSrc = video.src;
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
    this.renderer.setAttribute(sourceElement, "src", this.videoSrc || "");
    this.renderer.setAttribute(sourceElement, "type", "video/mp4");
    this.renderer.appendChild(videoElement, sourceElement);
    this.renderer.appendChild(this.videoContainer?.nativeElement, videoElement);
  }

  removeVideo() {
    const videoElement = this.videoContainer?.nativeElement.querySelector("video");
    if (videoElement) {
      this.renderer.removeChild(this.videoContainer?.nativeElement, videoElement);
    }
  }

  submitForm() {
    this.isLoading = true;
    this.isClickImage = false;
    this.isClickVideo = false;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.imageSrc) {
        this.isClickImage = true;
      }
      if (this.artistId && this.artistId.length === 0) {
        this.isArtist = true;
        return;
      }
      if (this.styleArray && this.styleArray.length === 0) {
        this.isStyle = true;
        return;
      }
      this.scrollToFirstInvalidControl();
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      if (
        this.artistId &&
        this.artistId.length === 0 &&
        this.styleArray &&
        this.styleArray.length === 0
      ) {
        this.isArtist = true;
        this.isStyle = true;
        return;
      }
      if (this.artistId && this.artistId.length === 0) {
        this.isArtist = true;
        this.scrollToFirstInvalidControl();
        return;
      }
      if (this.styleArray && this.styleArray.length === 0) {
        this.scrollToFirstInvalidControl();
        this.isStyle = true;
        return;
      }
      if (this.description == "" || null) {
        this.scrollToFirstInvalidControl();
        this.isDescriptions = true;
        return;
      }
      if (this.lyrics == "" || null) {
        this.scrollToFirstInvalidControl();
        this.isLyrics = true;
        return;
      }
      this.formGroup?.disable();
    }
    this.setFormData();
    this.updateVideo();
  }

  private scrollToFirstInvalidControl() {
    if (this.formGroup?.get("name")?.value == "") {
      const firstInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#videoName");
      firstInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidControl.focus({ preventScroll: true });
    } else if (this.isArtist == true) {
      const secondInvalidControl: HTMLElement =
        this.el.nativeElement.querySelector("#addArtistName");
      secondInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      secondInvalidControl.focus({ preventScroll: true });
    } else if (this.isStyle == true) {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#addStyle");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.isDescriptions == true) {
      this.editorDescription?.editorInstance!.editing.view.focus();
      const el = document.getElementById("editorDescription");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.isLyrics == true) {
      this.editorLyric?.editorInstance!.editing.view.focus();
      const el = document.getElementById("editorLyric");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  setFormData() {
    const slug = this.formGroup?.get("slug")?.value;
    this.formData.append("id", this.formGroup?.get("id")?.value);
    this.formData.append("name", this.formGroup?.get("name")?.value.trim());
    this.formData.append("slug", slug && slug !== null ? slug : generateRandomString(10));
    this.formData.append("description", this.description ?? "");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.formData.append("styleIds", this.styleArray);
    // @ts-ignore
    this.formData.append("artists", this.artistId);
    this.formData.append("lyrics", this.lyrics ?? "");
    this.formData.append("partnerId", this.formGroup?.get("partner")?.value);
    this.formData.append("status", this.formGroup?.get("status")?.value);
    this.formData.append("isActive", this.formGroup?.get("isActive")?.value);
    this.formData.append("videoThumbnail", this.videoThumbnail ?? "");
    this.formData.append("video", this.videoFile ?? "");
  }

  updateVideo() {
    this._videoService
      .updateVideo(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/video/list");
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
    dialogRef.componentInstance.subTiltle = `คุณต้องการลบระดับแอดมิน ‘${name}’ ใช่หรือไม่ ? เมื่อลบแล้วจะไม่สามารถนำกลับมาได้`;
    dialogRef.componentInstance.cancel = "ยกเลิก";
    dialogRef.componentInstance.done = "ยืนยัน";
    dialogRef.afterClosed().subscribe(value => {
      if (value == "OK") {
        this.deleteVideo(id);
      }
    });
  }

  deleteVideo(id: string) {
    this._videoService.deleteVideo(id).subscribe({
      next: () => {
        this._toastr.success("Delete", "Delete success");
        this._router.navigateByUrl("/video/list");
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
