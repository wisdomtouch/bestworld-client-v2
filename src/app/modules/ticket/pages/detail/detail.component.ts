import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualScrollViewport,
  ScrollingModule,
} from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { TicketStatus } from "@app/shared/enums/ticket.emum";
import { MaterialModule } from "@app/shared/modules/material.module";

import { TicketService } from "@services/ticket/ticket.service";
import { Ticket, TicketRequest } from "@services/ticket/ticket.type";

import { ErrorUtils } from "@utils/error.utils";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-detail",
  standalone: true,
  imports: [
    AlertComponent,
    CdkFixedSizeVirtualScroll,
    CdkVirtualScrollViewport,
    ChipStatusComponent,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ScrollingModule,
    TablerIconsModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent implements OnInit {
  constructor(
    private _ticketService: TicketService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService,
    private _errorPipe: ErrorUtils,
    private _router: Router
  ) {}

  ticket?: Ticket;
  private readonly unsubscribe$: Subject<void> = new Subject();
  urlFile = environment.apiUrl + "/images/ticket";
  protected readonly TicketStatus = TicketStatus;
  formGroup?: FormGroup;
  isLoading = false;
  isShowAlert = false;
  alertMessage = "";

  ngOnInit() {
    this.initForm();
    this._ticketService.ticketById$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.ticket = value;
      this.formGroup?.patchValue(value);
      this._changeDetectorRef.markForCheck();
    });
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      id: [null, Validators.required],
      reason: [null, Validators.required],
      status: [null, Validators.required],
    });
  }

  submitForm() {
    this.isLoading = true;

    if (this.formGroup?.invalid) {
      this.isLoading = false;

      for (const control of Object.keys(this.formGroup?.controls)) {
        this.formGroup?.controls[control]?.markAsTouched();
      }
      return;
    } else {
      this.formGroup?.disable();
    }

    const bodyRequest: TicketRequest = {
      id: this.formGroup?.get("id")?.value,
      reason: this.formGroup?.get("reason")?.value,
      status: this.formGroup?.get("status")?.value,
    };

    this._ticketService
      .updateTicket(bodyRequest)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastr.success("Success", "บันทึกสำเร็จ");
          this._router.navigateByUrl("/ticket-requests/list");
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

  protected readonly chipColorConstants = chipColorConstants;
}
