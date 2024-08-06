import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
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

import { StylesService } from "@services/styles/styles.service";

import { ErrorUtils } from "@utils/error.utils";
import { generateRandomString, slugValidator } from "@utils/utils";

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
  templateUrl: "./create.component.html",
})
export class CreateComponent implements OnInit, OnDestroy {
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private _stylesService: StylesService,
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
      slug: [null, [slugValidator()]],
      isActive: [true],
    });
  }

  submitForm() {
    this.isLoading = true;
    if (this.formGroup?.invalid) {
      this.isLoading = false;
      this.scrollToFirstInvalidControl();
      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      this.formGroup?.disable();
    }
    const slug = this.formGroup?.get("slug")?.value;
    const bodyRequest = {
      name: this.formGroup?.get("name")?.value,
      slug: slug && slug !== null ? slug : generateRandomString(10),
      isActive: this.formGroup?.get("isActive")?.value,
    };

    this._stylesService
      .createStyle(bodyRequest)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/style/list");
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
      const firstInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#styleName");
      firstInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidControl.focus({ preventScroll: true });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
