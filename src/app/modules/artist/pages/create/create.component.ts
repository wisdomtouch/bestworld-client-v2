import { CommonModule, formatDate } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";
import { Router } from "@angular/router";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
// import { ShowCropImageComponent } from "@app/shared/components/dialog/show-crop-image/show-crop-image.component";
import { DialogStyleComponent } from "@app/shared/components/dialog/show-style/show-style.component";
import { MaterialModule } from "@app/shared/modules/material.module";

import { ArtistService } from "@services/artists/artists.service";
import { CkUploadAdapter } from "@services/ck-upload.service";
import { OptionService } from "@services/option/option.service";
import { StyleOption } from "@services/option/option.types";

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
    DataNotFoundComponent,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit, OnDestroy {
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

  private readonly unsubscribe$: Subject<void> = new Subject();
  @ViewChild("editorDescription") editorDescription: CKEditorComponent | undefined;
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  description?: string;
  uid = uid(32);
  styleList?: StyleOption[];
  artistProfile?: Blob;
  coverPage?: Blob;
  isClickImage = true;
  isClickImageCover = true;
  isDescription = false;
  formData = new FormData();
  code? = "#000";
  styleId?: Array<string> = [];
  styleName?: Array<string> = [];
  isStyle = true;
  maxDate?: Date;

  constructor(
    private _formBuilder: FormBuilder,
    private _optionService: OptionService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _artistService: ArtistService,
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
    const date = new Date();
    date.setFullYear(date.getFullYear() + 13);
    formatDate(date, "mm/dd/yyyy", "en-US");
    this.maxDate = date;
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      name: [null, Validators.required],
      codeColor: ["#000", Validators.required],
      slug: [null, [slugValidator()]],
      styleIds: [{ value: null, disabled: true }, Validators.required],
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
      artistProfile: [null, Validators.required],
      coverPage: [null, Validators.required],
      isActive: [true],
    });
  }
  openDialog(): void {
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
        this.isStyle = true;
      }
    });
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
  public onChangeDescription(editor: any) {
    this.description = editor.editor?.getData();
    this.isDescription = false;
  }

  selectColor(val: MatSelectChange) {
    this.code = val.value;
  }

  /* eslint-disable */

  imageArtistProfileEvent(blob: Blob) {
    this.artistProfile = blob;
    this.formGroup?.get("artistProfile")?.patchValue(`${blob.type}`);
  }
  imageArtistCoverEvent(blob: Blob) {
    this.coverPage = blob;
    this.formGroup?.get("coverPage")?.patchValue(`${blob.type}`);
  }

  submitForm() {
    this.isLoading = true;
    this.isClickImage = true;
    this.isClickImageCover = true;
    this.isStyle = true;
    this.isDescription = false;

    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.artistProfile) {
        this.isClickImage = false;
      }
      if (!this.coverPage) {
        this.isClickImageCover = false;
      }
      if (!this.description) {
        this.isDescription = true;
      }

      if (this.styleId && this.styleId.length === 0) {
        this.isStyle = false;
      }
      this.scrollToFirstInvalidControl();
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      if (this.styleId && this.styleId.length === 0) {
        this.isStyle = false;
        return;
      }
      this.formGroup?.disable();
    }

    this.setFormData();

    this._artistService
      .createArtist(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/artist/list");
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
    if (this.formGroup?.get("name")?.value == null) {
      const firstInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#artistName");
      firstInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("styleIds")?.value == null) {
      const thirdInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#addStyle");
      thirdInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      thirdInvalidControl.focus({ preventScroll: true });
    } else if (this.isDescription == true) {
      this.editorDescription?.editorInstance!.editing.view.focus();
      const el = document.getElementById("editorDescription");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.artistProfile == null) {
      const el = document.getElementById("artistProfile");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.coverPage == null) {
      const el = document.getElementById("artistCover");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  setFormData() {
    const slug = this.formGroup?.get("slug")?.value;
    this.formData = new FormData();
    this.formData.append("name", this.formGroup?.get("name")?.value);
    this.formData.append("slug", slug && slug !== null ? slug : generateRandomString(10));
    // @ts-ignore
    this.formData.append("styleIds", this.styleId);
    this.formData.append("codeColor", this.formGroup?.get("codeColor")?.value);
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
    this.formData.append("artistProfile", this.artistProfile ?? "");
    this.formData.append("coverPage", this.coverPage ?? "");
    this.formData.append("isActive", this.formGroup?.get("isActive")?.value);
    this.formData.append("description", this.description ?? "");
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
