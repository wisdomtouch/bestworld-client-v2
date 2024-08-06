import { CommonModule, formatDate } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSelectChange } from "@angular/material/select";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { DialogShowArtistComponent } from "@app/shared/components/dialog/show-artist/show-artist/show-artist.component";
import { DialogStyleComponent } from "@app/shared/components/dialog/show-style/show-style.component";
import { paginationOption } from "@app/shared/constants/pagination.constant";
import { MaterialModule } from "@app/shared/modules/material.module";

import { DialogVideoComponent } from "@modules/album/pages/component/show-video/dialog-show-video.component";

import { AlbumService } from "@services/albums/albums.service";
import { CkUploadAdapter } from "@services/ck-upload.service";
import { OptionService } from "@services/option/option.service";
import { ArtistsOption, PartnerOption, StyleOption } from "@services/option/option.types";
import { Video } from "@services/videos/videos.type";

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
    DataNotFoundComponent,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  uid = uid(32);
  styleList?: StyleOption[];
  artistList?: ArtistsOption[];
  partnerList?: PartnerOption[];
  albumThumbnail?: Blob;
  imageSrc?: string | ArrayBuffer;
  isClickImage = true;
  albumCover?: Blob;
  imageCoverSrc?: string | ArrayBuffer;
  isClickImageCover = true;
  isCheckNext = true;
  formData = new FormData();
  step = 1;
  videos?: Video[];
  artistId?: string;
  isCheckMusic = true;
  musicArray: Array<string> = [];
  searchInput: FormControl = new FormControl("");
  videoDisplayColumns: string[] = ["no", "name", "duration", "action"];
  urlImage = environment.apiUrl + "/images/";
  @ViewChild(MatPaginator) _matPaginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort) _matSort: MatSort = Object.create(null);
  @ViewChild(MatTable) _matTable: MatTable<void> = Object.create(null);
  @ViewChild("editorDescription") editorDescription: CKEditorComponent | undefined;
  protected readonly paginationOption = paginationOption;
  dataSource = new MatTableDataSource(this.videos);
  styleId?: Array<string> = [];
  styleName?: Array<string> = [];
  artistName?: string;
  code = "#000";
  Editor = DecoupledEditor;
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
  description?: string;
  descriptionEdit?: string;
  isStyle = false;
  isArtist = false;
  isDescription = false;
  checkStepOneThumbnail = false;
  checkStepOneCover = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _optionService: OptionService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _albumService: AlbumService,
    private _router: Router,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    public _dialog: MatDialog,
    private el: ElementRef
  ) {}
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
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      name: [null, Validators.required],
      codeColor: [this.code],
      slug: [null, [slugValidator()]],
      styleIds: [{ value: null, disabled: true }, Validators.required],
      artistId: [{ value: null, disabled: true }, Validators.required],
      albumThumbnail: [null, Validators.required],
      albumCover: [null, Validators.required],
      partner: [null, Validators.required],
      isActive: [true],
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
      releasedAt: [
        formatDate(
          new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd 00:00:00",
          "en-US"
        ),
      ],
    });
  }

  selectColor(val: MatSelectChange) {
    this.code = val.value;
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
    const dialogRef = this._dialog.open(DialogShowArtistComponent, {
      data: {
        artistOption: this.artistList ?? [],
        artistName: this.artistName,
        artistId: this.artistId,
      },
      width: "500px",
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.artistId = value.item.id;
        this.artistName = value.item.name;
        this.formGroup?.get("artistId")?.setValue(value.item.name);
        this.videos = [];
        this.dataSource = new MatTableDataSource();
        this._optionService.getVideoOptionByArtist(value.item.id).subscribe();
        this.isArtist = false;
      }
    });
  }

  imageAlbumThumbnailEvent(blob: Blob) {
    this.albumThumbnail = blob;
    this.checkStepOneThumbnail = false;
    this.imageSrc = "";
    this.formGroup?.get("albumThumbnail")?.patchValue(`${blob.type}`);
  }
  imageAlbumCoverEvent(blob: Blob) {
    this.albumCover = blob;
    this.checkStepOneCover = false;
    this.imageCoverSrc = "";
    this.formGroup?.get("albumCover")?.patchValue(`${blob.type}`);
  }

  /* eslint-disable */
  public onReady(editor: any): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return new CkUploadAdapter(loader, "blog", this.uid);
    };
  }

  /* eslint-disable */
  public onChangeDescription(editor: any) {
    this.description = editor.editor?.getData();
    if (this.description) {
      this.isDescription = false;
    } else {
      this.isDescription = true;
    }
  }

  nextStep(val: number) {
    if (val === 1) {
      this.step = 1;
      this.blobToImageAlbumThumbnail(this.albumThumbnail).finally();
      this.blobToImageAlbumCover(this.albumCover).finally();
      this.checkStepOneThumbnail = true;
      this.checkStepOneCover = true;
      this.descriptionEdit = this.description;
    }
    if (val === 2) {
      this.nextForm();
    }
  }
  blobToImageAlbumThumbnail = (blob: Blob | MediaSource | undefined) => {
    return new Promise(resolve => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img);
        };
        this.imageSrc = url;
      }
    });
  };
  blobToImageAlbumCover = (blob: Blob | MediaSource | undefined) => {
    return new Promise(resolve => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img);
        };
        this.imageCoverSrc = url;
      }
    });
  };

  openDialog(): void {
    const dialogRef = this._dialog.open(DialogVideoComponent, {
      data: {
        musicId: this.videos ?? [],
        artistId: this.artistId,
      },
      width: "1000px",
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.videos = value;
        this.dataSource = new MatTableDataSource(value);
        this.isCheckMusic = true;
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteRow(val: string): boolean | void {
    this.dataSource.data = this.dataSource.data.filter((value: Video) => {
      return value.id !== val;
    });
    this.videos = this.videos?.filter(value => {
      return val !== value.id;
    });
  }

  nextForm() {
    this.isClickImage = true;
    this.isClickImageCover = true;
    this.isCheckNext = false;
    this.isStyle = false;
    this.isArtist = false;
    this.isDescription = false;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.albumThumbnail) {
        this.isClickImage = false;
      }
      if (!this.albumCover) {
        this.isClickImageCover = false;
      }
      if (this.styleId && this.styleId.length === 0) {
        this.isStyle = true;
      }
      if (!this.artistId) {
        this.isArtist = true;
      }
      if (!this.description) {
        this.isDescription = true;
      }
      this.scrollToFirstInvalidControl();
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      if (!this.artistId && this.styleId && this.styleId.length === 0) {
        this.isArtist = false;
        this.isStyle = false;
        return;
      }
      if (!this.artistId) {
        this.isArtist = true;
        return;
      }
      if (this.styleId && this.styleId.length === 0) {
        this.isStyle = true;
        this.scrollToFirstInvalidControl();
        return;
      }
      if (!this.description) {
        this.isDescription = true;
        this.scrollToFirstInvalidControl();
        return;
      }
      this.step = 2;
      this.isCheckNext = true;
    }
  }

  submitForm() {
    this.isLoading = true;
    this.isClickImage = true;
    this.isClickImageCover = true;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.imageSrc) {
        this.isClickImage = false;
      }
      if (!this.imageCoverSrc) {
        this.isClickImageCover = false;
      }
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      this.videos?.map(val => {
        const id = val.id;
        this.musicArray.push(id);
      });
      if (this.musicArray.length <= 0) {
        this.isCheckMusic = false;
        return;
      }
      this.formGroup?.disable();
    }

    this.setFormData();
    this._albumService
      .createAlbum(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/album/list");
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
    if (this.formGroup?.get("name")?.value == "") {
      const firstInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#albumName");
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
    } else if (this.isDescription == true) {
      this.editorDescription?.editorInstance!.editing.view.focus();
      const el = document.getElementById("editorDescription");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.albumThumbnail == null) {
      const el = document.getElementById("albumImage");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.albumCover == null) {
      const el = document.getElementById("albumCover");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  setFormData() {
    const slug = this.formGroup?.get("slug")?.value;
    this.formData = new FormData();
    this.formData.append("name", this.formGroup?.get("name")?.value);
    this.formData.append("slug", slug && slug !== null ? slug : generateRandomString(10));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.formData.append("styleIds", this.styleId);
    this.formData.append("artistId", this.artistId ?? "");
    this.formData.append("detail", this.formGroup?.get("detail")?.value);
    this.formData.append("albumThumbnail", this.albumThumbnail ?? "");
    this.formData.append("coverPage", this.albumCover ?? "");
    this.formData.append("isActive", this.formGroup?.get("isActive")?.value);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.formData.append("videoIds", this.musicArray);
    this.formData.append("codeColor", this.code);
    this.formData.append("description", this.description ?? "");
    this.formData.append("partnerId", this.formGroup?.get("partner")?.value);
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
    this.formData.append(
      "releasedAt",
      formatDate(
        new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd 00:00:00",
        "en-US"
      )
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
