import { CommonModule, formatDate } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { MaterialModule } from "@app/shared/modules/material.module";

import { UserService } from "@services/users/users.service";

import { ErrorUtils } from "@utils/error.utils";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-create",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit, OnDestroy {
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  userProfile?: File;
  imageSrc?: string | ArrayBuffer;
  isClickImage = true;
  private readonly unsubscribe$: Subject<void> = new Subject();
  formData = new FormData();
  urlImage = environment.apiUrl + "/images/";

  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this._userService.userById$.pipe(takeUntil(this.unsubscribe$)).subscribe((value): void => {
      this.isLoading = false;
      this.formGroup?.patchValue(value);
      this.imageSrc = value.image ? this.urlImage + value.image : "";
      this._changeDetectorRef.markForCheck();
    });
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      image: [null],
      gender: [null, Validators.required],
      googleUsername: [{ value: null, disabled: true }],
      dateOfBirth: [null],
      isActive: [true],
    });
  }

  handleFileInputChangeProfile(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    this.isClickImage = true;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      this.userProfile = file;
      this.formGroup?.get("albumThumbnail")?.patchValue(`${file?.name}`);
      const reader = new FileReader();
      reader.onload = () => (this.imageSrc = reader.result ?? "");
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  submitForm() {
    this.isLoading = true;
    this.isClickImage = true;

    if (this.formGroup?.invalid) {
      this.isLoading = false;
      if (!this.imageSrc) {
        this.isClickImage = false;
      }

      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      this.formGroup?.disable();
    }

    this.setFormData();

    this._userService
      .updateUser(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/user/list");
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

  setFormData() {
    this.formData = new FormData();
    this.formData.append("id", this.formGroup?.get("id")?.value);
    this.formData.append("name", this.formGroup?.get("name")?.value);
    this.formData.append("googleUsername", this.formGroup?.get("googleUsername")?.value);
    this.formData.append("isActive", this.formGroup?.get("isActive")?.value);
    this.formData.append("gender", this.formGroup?.get("gender")?.value);
    this.formData.append(
      "dateOfBirth",
      this.formGroup?.get("dateOfBirth")?.value
        ? formatDate(this.formGroup?.get("dateOfBirth")?.value, "yyyy-MM-dd hh:mm:ss", "en-US")
        : ""
    );
    this.formData.append("profileImage", this.userProfile ?? "");
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
