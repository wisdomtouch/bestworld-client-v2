import { CommonModule } from "@angular/common";
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
import { DialogImgUrlComponent } from "@app/shared/components/dialog/show-image/dialog-show-image.component";
import { DialogStyleComponent } from "@app/shared/components/dialog/show-style/show-style.component";
import { paginationOption } from "@app/shared/constants/pagination.constant";
import { MaterialModule } from "@app/shared/modules/material.module";

import { DialogVideoComponent } from "@modules/playlist/pages/component/show-video/dialog-show-video.component";

import { CkUploadAdapter } from "@services/ck-upload.service";
import { OptionService } from "@services/option/option.service";
import { PartnerOption, StyleOption } from "@services/option/option.types";
import { PlaylistService } from "@services/playlists/playlists.service";
import { Video, VideoPagination } from "@services/videos/videos.type";

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
  @ViewChild("editorDescription") editorDescription: CKEditorComponent | undefined;
  private readonly unsubscribe$: Subject<void> = new Subject();
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  videos?: Video[];
  videoPagination!: VideoPagination;
  Editor = DecoupledEditor;
  musicArray: Array<string> = [];

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
  uid = uid(32);
  playlistThumbnail?: Blob;
  playlistCover?: Blob;
  imageSrc?: string | ArrayBuffer;
  imageSrcCover?: string | ArrayBuffer;
  isClickImage = false;
  isClickImageCover = false;
  isCheckMusic = true;
  step = 1;
  isCheckNext = false;
  formData = new FormData();
  searchInput: FormControl = new FormControl("");
  videoDisplayColumns: string[] = ["no", "name", "artist", "action"];
  urlImage = environment.apiUrl + "/images/";

  @ViewChild(MatPaginator) _matPaginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort) _matSort: MatSort = Object.create(null);
  @ViewChild(MatTable) _matTable: MatTable<void> = Object.create(null);
  protected readonly paginationOption = paginationOption;
  dataSource = new MatTableDataSource(this.videos);
  code = "#000";
  styleList?: StyleOption[];
  partnerList?: PartnerOption[];
  styleId?: Array<string> = [];
  styleName?: Array<string> = [];
  isStyle = false;
  isDescription = false;
  checkStepOneThumbnail = false;
  checkStepOneCover = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _playlistService: PlaylistService,
    public _dialog: MatDialog,
    private _optionService: OptionService,
    private _changeDetectorRef: ChangeDetectorRef,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this._optionService.styleOption$.pipe(takeUntil(this.unsubscribe$)).subscribe((value): void => {
      this.styleList = value;
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
      slug: [null, [slugValidator()]],
      codeColor: ["#000"],
      styleIds: [{ value: null, disabled: true }, Validators.required],
      videoIds: [null],
      isActive: [true],
      playlistThumbnail: [null, Validators.required],
      playlistCover: [null, Validators.required],
      partner: [null, Validators.required],
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

  selectColor(val: MatSelectChange) {
    this.code = val.value;
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

  imagePlaylistThumbnailEvent(blob: Blob) {
    this.playlistThumbnail = blob;
    this.checkStepOneThumbnail = false;
    this.imageSrc = "";
    this.formGroup?.get("playlistThumbnail")?.patchValue(`${blob.type}`);
  }
  imagePlaylistCoverEvent(blob: Blob) {
    this.playlistCover = blob;
    this.checkStepOneCover = false;
    this.imageSrcCover = "";
    this.formGroup?.get("playlistCover")?.patchValue(`${blob.type}`);
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(DialogVideoComponent, {
      data: {
        musicId: this.videos ?? [],
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

  zoomImage(url: string): void {
    this._dialog.open(DialogImgUrlComponent, {
      data: {
        url: url,
      },
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

  nextStep(val: number) {
    if (val === 1) {
      this.step = 1;
      this.blobToImagePlaylistThumbnail(this.playlistThumbnail).finally();
      this.blobToImagePlaylistCover(this.playlistCover).finally();
      this.checkStepOneThumbnail = true;
      this.checkStepOneCover = true;
      this.descriptionEdit = this.description;
    }
    if (val === 2) {
      this.nextForm();
    }
  }
  blobToImagePlaylistThumbnail = (blob: Blob | MediaSource | undefined) => {
    return new Promise(resolve => {
      // @ts-ignore
      const url = URL.createObjectURL(blob);
      let img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      this.imageSrc = url;
    });
  };
  blobToImagePlaylistCover = (blob: Blob | MediaSource | undefined) => {
    return new Promise(resolve => {
      // @ts-ignore
      const url = URL.createObjectURL(blob);
      let img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      this.imageSrcCover = url;
    });
  };

  nextForm() {
    this.isClickImage = false;
    this.isClickImageCover = false;
    this.isCheckNext = false;
    this.isStyle = false;
    this.isDescription = false;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.playlistThumbnail) {
        this.isClickImage = true;
      }
      if (!this.playlistCover) {
        this.isClickImageCover = true;
      }
      if (this.styleId && this.styleId.length === 0) {
        this.isStyle = true;
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
    this.isClickImage = false;
    this.isClickImageCover = false;
    this.isCheckMusic = true;

    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.imageSrc) {
        this.isClickImage = true;
      }
      if (!this.imageSrcCover) {
        this.isClickImageCover = true;
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

    this.setForm();

    this._playlistService
      .createPlaylist(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/playlist/list");
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
      const firstInvalidControl: HTMLElement =
        this.el?.nativeElement?.querySelector("#playlistName");
      firstInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidControl.focus({ preventScroll: true });
    } else if (this.isStyle == true) {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#addStyle");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.isDescription == true) {
      this.editorDescription?.editorInstance!.editing.view.focus();
      const el = document.getElementById("editorDescription");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.playlistThumbnail == null) {
      const el = document.getElementById("playlistImage");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.playlistCover == null) {
      const el = document.getElementById("playlistCoverPage");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  setForm() {
    const slug = this.formGroup?.get("slug")?.value;
    this.formData = new FormData();
    this.formData.append("name", this.formGroup?.get("name")?.value);
    this.formData.append("slug", slug && slug !== null ? slug : generateRandomString(10));
    this.formData.append("codeColor", this.code);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.formData.append("styleIds", this.styleId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.formData.append("videoIds", this.musicArray);
    this.formData.append("playlistThumbnail", this.playlistThumbnail ?? "");
    this.formData.append("coverPage", this.playlistCover ?? "");
    this.formData.append("isActive", this.formGroup?.get("isActive")?.value);
    this.formData.append("description", this.description ?? "");
    this.formData.append("partnerId", this.formGroup?.get("partner")?.value);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
