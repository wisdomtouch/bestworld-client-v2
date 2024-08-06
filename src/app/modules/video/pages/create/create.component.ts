import { CommonModule, formatDate } from "@angular/common";
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

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { DialogShowArtistsComponent } from "@app/shared/components/dialog/show-artist/show-artists/show-artist.component";
import { DialogStyleComponent } from "@app/shared/components/dialog/show-style/show-style.component";
import { MaterialModule } from "@app/shared/modules/material.module";

import { CkUploadAdapter } from "@services/ck-upload.service";
import { OptionService } from "@services/option/option.service";
import {
  AlbumsOption,
  ArtistsOption,
  PartnerOption,
  StyleOption,
} from "@services/option/option.types";
import { VideoService } from "@services/videos/videos.service";

import { ErrorUtils } from "@utils/error.utils";
import { generateRandomString, slugValidator } from "@utils/utils";

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
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _optionService: OptionService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _videoService: VideoService,
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
  videoThumbnail!: Blob;
  imageSrc?: string | ArrayBuffer;
  isClickImage = false;
  videoFile?: File;
  videoDuration?: number;
  formData = new FormData();
  videoSrc?: string;
  isClickVideo = false;
  lyrics?: string;
  description?: string;
  uid = uid(32);
  isLyrics = false;
  isDescription = false;
  styleId?: Array<string> = [];
  styleName?: Array<string> = [];
  artistId?: Array<string> = [];
  artistName?: Array<string> = [];
  @ViewChild("videoContainer", { read: ElementRef }) videoContainer!: ElementRef;
  maxDate?: Date;
  isStyle = false;
  isArtist = false;

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
    this._optionService.partnerOption$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.partnerList = value;
        const select = this.partnerList?.filter(e => e.name === "KETUBE") || null;
        this.formGroup?.get("partner")?.setValue(select[0]?.id);
        this._changeDetectorRef.markForCheck();
      });
    const date = new Date();
    date.setFullYear(date.getFullYear() + 13);
    formatDate(date, "mm/dd/yyyy", "en-US");
    this.maxDate = date;
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      name: [null, Validators.required],
      slug: [null, [slugValidator()]],
      styleIds: [{ value: null, disabled: true }, Validators.required],
      artists: [{ value: null, disabled: true }, Validators.required],
      releasedAt: [
        formatDate(
          new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd 00:00:00",
          "en-US"
        ),
      ],
      publishedAt: [
        formatDate(
          new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd 00:00:00",
          "en-US"
        ),
      ],
      expiredAt: [
        formatDate(
          new Date(new Date().getTime() + 365 * 5 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd 00:00:00",
          "en-US"
        ),
      ],
      lyrics: [null],
      description: [null],
      videoThumbnail: [null, Validators.required],
      video: [null, Validators.required],
      status: [true, Validators.required],
      partner: [null, Validators.required],
      isActive: [true],
    });
  }

  openDialogStyle(): void {
    const dialogRef = this._dialog.open(DialogStyleComponent, {
      data: {
        styleOption: this.styleList ?? [],
        styleName: this.styleName,
        styleId: this.styleId,
      },
      width: "500px",
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.styleId = value.styleId;
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
  public onChangeLyrics(editor: any) {
    this.lyrics = editor.editor?.getData();
    this.isLyrics = false;
  }
  public onChangeDescription(editor: any) {
    this.description = editor.editor?.getData();
    this.isDescription = false;
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
          this.videoFile = file;
          this.formGroup?.get("video")?.patchValue(`${file?.name}`);
          const video = document.createElement("video");
          video.src = window.URL.createObjectURL(file);
          video.preload = "metadata";
          video.onloadedmetadata = () => {
            this.videoDuration = video.duration;
          };
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

  imageVideoThumbnailEvent(blob: Blob) {
    this.videoThumbnail = blob;
    this.formGroup?.get("videoThumbnail")?.patchValue(`${blob.type}`);
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

  removeTagVideo() {
    const videoElement = this.videoContainer?.nativeElement.querySelector("video");
    if (videoElement) {
      this.renderer.removeChild(this.videoContainer?.nativeElement, videoElement);
    }
  }

  submitForm() {
    this.isLoading = true;
    this.isClickImage = false;
    this.isClickVideo = false;
    this.isLyrics = false;
    this.isDescription = false;
    this.isStyle = false;
    this.isArtist = false;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.videoThumbnail) {
        this.isClickImage = true;
      }
      if (!this.videoSrc) {
        this.isClickVideo = true;
      }
      if (!this.lyrics) {
        this.isLyrics = true;
      }
      if (!this.description) {
        this.isDescription = true;
      }
      if (this.styleId && this.styleId.length === 0) {
        this.isStyle = true;
      }
      if (this.artistId && this.artistId.length === 0) {
        this.isArtist = true;
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
        this.styleId &&
        this.styleId.length === 0
      ) {
        this.isArtist = true;
        this.isStyle = true;
        return;
      }
      if (this.artistId && this.artistId.length === 0) {
        this.isArtist = true;
        return;
      }
      if (this.styleId && this.styleId.length === 0) {
        this.isStyle = true;
        return;
      }
      this.formGroup?.disable();
    }

    this.setFormData();
    this.createVideo();
  }
  private scrollToFirstInvalidControl() {
    if (this.formGroup?.get("name")?.value == null) {
      const firstInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#videoName");
      firstInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("artists")?.value == null) {
      const secondInvalidControl: HTMLElement =
        this.el.nativeElement.querySelector("#addArtistName");
      secondInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      secondInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("styleIds")?.value == null) {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#addStyle");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.isDescription == true) {
      this.editorDescription?.editorInstance!.editing.view.focus();
      const el = document.getElementById("editorDescription");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.isLyrics == true) {
      this.editorLyric?.editorInstance!.editing.view.focus();
      const el = document.getElementById("editorLyric");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.videoThumbnail == null) {
      const el = document.getElementById("videoImage");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.videoFile == null) {
      const el = document.getElementById("musicVideo");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  setFormData() {
    const slug = this.formGroup?.get("slug")?.value;
    this.formData = new FormData();
    this.formData.append("name", this.formGroup?.get("name")?.value.trim());
    this.formData.append("slug", slug && slug !== null ? slug.trim() : generateRandomString(10));
    this.formData.append("description", this.description ?? "");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.formData.append("styleIds", this.styleId);
    // @ts-ignore
    this.formData.append("artists", this.artistId);
    this.formData.append("lyrics", this.lyrics ?? "");
    this.formData.append("partnerId", this.formGroup?.get("partner")?.value);
    this.formData.append("status", this.formGroup?.get("status")?.value);
    this.formData.append("isActive", this.formGroup?.get("isActive")?.value);
    this.formData.append(
      "releasedAt",
      formatDate(
        new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd 00:00:00",
        "en-US"
      )
    );
    this.formData.append(
      "publishedAt",
      formatDate(
        new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd 00:00:00",
        "en-US"
      )
    );
    this.formData.append(
      "expiredAt",
      formatDate(
        new Date(new Date().getTime() + 365 * 5 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd 00:00:00",
        "en-US"
      )
    );
    this.formData.append("videoThumbnail", this.videoThumbnail);
    this.formData.append("video", this.videoFile ?? "");
  }

  createVideo() {
    this._videoService
      .createVideo(this.formData)
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected readonly onsubmit = onsubmit;
}
