import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
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

import { NavigatorService } from "@app/services/navigators/navigators.service";
import { Permission } from "@app/services/navigators/navigators.type";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { AppDialogComponent } from "@app/shared/components/dialog/dialog.component";
import { DialogStyleComponent } from "@app/shared/components/dialog/show-style/show-style.component";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { ArtistService } from "@services/artists/artists.service";
import { CkUploadAdapter } from "@services/ck-upload.service";
import { OptionService } from "@services/option/option.service";
import { StyleOption } from "@services/option/option.types";

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
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit, OnDestroy {
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
  accountArtistPermission?: Permission;
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  description?: string;
  descriptionEdit!: string;
  uid = uid(32);
  styleList?: StyleOption[];
  artistProfile?: Blob;
  coverPage?: Blob;
  imageSrc?: string | ArrayBuffer;
  imageSrcCover!: string | ArrayBuffer;
  isClickImage = true;
  isClickImageCover = true;
  formData = new FormData();
  urlImage = environment.apiUrl + "/images/";
  styleArray: Array<string> = [];
  styleId: Array<string> = [];
  code = "#000";
  isStyle = false;
  isDescription = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _optionService: OptionService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _artistService: ArtistService,
    private _navigatorService: NavigatorService,
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
    this._artistService.artistById$.pipe(takeUntil(this.unsubscribe$)).subscribe((value): void => {
      this.isLoading = false;
      this.formGroup?.patchValue(value);
      value.styles.map(e => {
        this.styleArray.push(e.name);
        this.styleId.push(e.id);
      });
      this.imageSrc = this.urlImage + value.image;
      this.imageSrcCover = this.urlImage + value.coverPage;
      this.descriptionEdit = value.description;
      this.description = value.description;
      this.formGroup?.get("artistProfile")?.setValue(value.image);
      this.formGroup?.get("styleIds")?.setValue(this.styleArray);
      this.code = value.codeColor;
      this._changeDetectorRef.markForCheck();
    });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountArtistPermission = value.permission.find(
          v => v.menu === PermissionEnum.Artists
        );
      });
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      codeColor: [null, Validators.required],
      slug: [null, [slugValidator()]],
      styleIds: [{ value: null, disabled: true }, Validators.required],
      artistProfile: [null, Validators.required],
      coverPage: [null, Validators.required],
      isActive: [true],
    });
  }

  selectColor(val: MatSelectChange) {
    this.code = val.value;
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(DialogStyleComponent, {
      data: {
        styleOption: this.styleList ?? [],
        styleName: this.styleArray,
        styleId: this.styleId,
      },
      width: "500px",
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.styleId = value.styleId;
        this.styleArray = value.styleName;
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
    if (this.description == "") {
      this.isDescription = true;
    }
    this.isDescription = false;
  }

  /* eslint-disable */

  imageArtistProfileEvent(blob: Blob) {
    this.artistProfile = blob;
    this.imageSrc = "";
    this.formGroup?.get("artistProfile")?.patchValue(`${blob.type}`);
  }
  imageArtistCoverEvent(blob: Blob) {
    this.coverPage = blob;
    this.imageSrcCover = "";
    this.formGroup?.get("coverPage")?.patchValue(`${blob.type}`);
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
      if (!this.imageSrcCover) {
        this.isClickImageCover = false;
      }
      if (this.styleId && this.styleId.length === 0) {
        this.isStyle = true;
        return;
      }
      this.scrollToFirstInvalidControl();
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      if (this.styleId && this.styleId.length === 0) {
        this.scrollToFirstInvalidControl();
        this.isStyle = true;
        return;
      }
      if (this.description == "" || null) {
        this.scrollToFirstInvalidControl();
        this.isDescription = true;
        return;
      }
      this.formGroup?.disable();
    }

    this.setFormData();

    this._artistService
      .updateArtist(this.formData)
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
    if (this.formGroup?.get("name")?.value == "") {
      const firstInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#artistName");
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
    }
  }

  setFormData() {
    const slug = this.formGroup?.get("slug")?.value;
    this.formData.append("id", this.formGroup?.get("id")?.value);
    this.formData.append("name", this.formGroup?.get("name")?.value);
    this.formData.append("slug", slug && slug !== null ? slug : generateRandomString(10));
    // @ts-ignore
    this.formData.append("styleIds", this.styleId);
    this.formData.append("codeColor", this.formGroup?.get("codeColor")?.value);
    this.formData.append("artistProfile", this.artistProfile ?? "");
    this.formData.append("coverPage", this.coverPage ?? "");
    this.formData.append("isActive", this.formGroup?.get("isActive")?.value);
    this.formData.append("description", this.description ?? "");
  }

  openDialogDelete(id: string): void {
    const name = this.formGroup?.get("name")?.value;
    const dialogRef = this._dialog.open(AppDialogComponent);
    dialogRef.componentInstance.tiltle = "ลบข้อมูล";
    dialogRef.componentInstance.subTiltle = `คุณต้องการลบศิลปิน ‘${name}’ ใช่หรือไม่ ? เมื่อลบแล้วจะไม่สามารถนำกลับมาได้`;
    dialogRef.componentInstance.cancel = "ยกเลิก";
    dialogRef.componentInstance.done = "ยืนยัน";
    dialogRef.afterClosed().subscribe(value => {
      if (value == "OK") {
        this.deleteArtist(id);
      }
    });
  }
  deleteArtist(id: string) {
    this._artistService.deleteArtist(id).subscribe({
      next: () => {
        this._toastr.success("Delete", "Delete success");
        this._router.navigateByUrl("/artist/list");
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
