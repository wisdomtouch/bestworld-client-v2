import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { CropImageComponent } from "@app/shared/components/crop-image/crop-image.component";
import { MaterialModule } from "@app/shared/modules/material.module";

import { CkUploadAdapter } from "@services/ck-upload.service";
import { PartnerService } from "@services/partner/partner.service";

import { ErrorUtils } from "@utils/error.utils";

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
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./create.component.html",
  styleUrl: "./create.component.scss",
})
export class CreateComponent implements OnInit {
  @ViewChild("editorDescription") editorDescription: CKEditorComponent | undefined;
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  partnerProfile?: Blob;
  imageSrc?: string | ArrayBuffer;
  isClickImage = false;
  formData = new FormData();
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
  uid = uid(32);
  private readonly unsubscribe$: Subject<void> = new Subject();
  isDescription = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _partnerService: PartnerService,
    private _router: Router,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      name: [null, Validators.required],
      partnerProfile: [null, Validators.required],
      description: [null],
      username: [null, Validators.required],
      isActive: [true],
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

  /* eslint-disable */
  public onChangeDescription(editor: any) {
    this.description = editor.editor?.getData();
  }

  imagePartnerProfileEvent(blob: Blob) {
    this.partnerProfile = blob;
    this.formGroup?.get("partnerProfile")?.patchValue(`${blob.type}`);
  }

  submitForm() {
    this.isLoading = true;
    this.isDescription = false;
    this.isClickImage = false;

    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.description) {
        this.isDescription = true;
      }

      if (!this.imageSrc) {
        this.isClickImage = true;
      }
      this.scrollToFirstInvalidControl();
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      this.formGroup?.disable();
    }

    this.setFormData();
    this._partnerService
      .createPartner(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/partner/list");
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
      const firstInvalidControl: HTMLElement =
        this.el?.nativeElement?.querySelector("#partnerName");
      firstInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidControl.focus({ preventScroll: true });
    } else if (this.formGroup?.get("username")?.value == null) {
      const firstInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#username");
      firstInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidControl.focus({ preventScroll: true });
    } else if (this.isDescription == true) {
      this.editorDescription?.editorInstance!.editing.view.focus();
      const el = document.getElementById("editorDescription");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (this.partnerProfile == null) {
      const el = document.getElementById("partnerProfile");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  setFormData() {
    this.formData = new FormData();
    this.formData.append("name", this.formGroup?.get("name")?.value);
    this.formData.append("username", this.formGroup?.get("username")?.value);
    this.formData.append("isActive", this.formGroup?.get("isActive")?.value);
    this.formData.append("description", this.description ?? "");
    this.formData.append("image", this.partnerProfile ?? "");
  }
}
