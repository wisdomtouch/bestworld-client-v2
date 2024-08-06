import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { Permission } from "@app/services/navigators/navigators.type";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { AppDialogComponent } from "@app/shared/components/dialog/dialog.component";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { NavigatorService } from "@services/navigators/navigators.service";
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
  templateUrl: "./edit.component.html",
})
export class EditComponent implements OnInit, OnDestroy {
  accountStylePermission?: Permission;
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
    private _changeDetectorRef: ChangeDetectorRef,
    private _navigatorService: NavigatorService,
    public _dialog: MatDialog,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this._stylesService.styleById$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.isLoading = false;
      this.formGroup?.patchValue(value);
      this._changeDetectorRef.markForCheck();
    });
    this._navigatorService.navigator$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value): void => {
        this.accountStylePermission = value.permission.find(v => v.menu === PermissionEnum.Styles);
      });
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      slug: [null, slugValidator()],
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
      id: this.formGroup?.get("id")?.value,
      name: this.formGroup?.get("name")?.value,
      slug: slug && slug !== null ? slug : generateRandomString(10),
      isActive: this.formGroup?.get("isActive")?.value,
    };

    this._stylesService
      .updateStyle(bodyRequest)
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
    if (this.formGroup?.get("name")?.value == "") {
      const firstInvalidControl: HTMLElement = this.el?.nativeElement?.querySelector("#styleName");
      firstInvalidControl.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidControl.focus({ preventScroll: true });
    }
  }

  openDialogDelete(id: string): void {
    const name = this.formGroup?.get("name")?.value;
    const dialogRef = this._dialog.open(AppDialogComponent);
    dialogRef.componentInstance.tiltle = "ลบข้อมูล";
    dialogRef.componentInstance.subTiltle = `คุณต้องการลบแนวเพลง ‘${name}’ ใช่หรือไม่ ? เมื่อลบแล้วจะไม่สามารถนำกลับมาได้`;
    dialogRef.componentInstance.cancel = "ยกเลิก";
    dialogRef.componentInstance.done = "ยืนยัน";
    dialogRef.afterClosed().subscribe(value => {
      if (value == "OK") {
        this.deleteStyle(id);
      }
    });
  }
  deleteStyle(id: string) {
    this._stylesService.deleteStyle(id).subscribe({
      next: () => {
        this._toastr.success("Delete", "Delete success");
        this._router.navigateByUrl("/style/list");
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
