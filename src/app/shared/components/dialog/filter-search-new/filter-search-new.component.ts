import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { MaterialModule } from "@app/shared/modules/material.module";
import { FilterSearch } from "@app/shared/types/shared.types";

import { TablerIconsModule } from "angular-tabler-icons";

export interface DialogData {
  isStatus: boolean;
  isDate: boolean;
  isName: boolean;
  filter: FilterSearch;
  filterCount: number;
}
@Component({
  selector: "app-filter-search-new",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    DataNotFoundComponent,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./filter-search-new.component.html",
  styleUrl: "./filter-search-new.component.scss",
})
export class FilterSearchNewComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<FilterSearchNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _formBuilder: FormBuilder
  ) {}
  formGroup?: FormGroup;
  filterData?: FilterSearch;
  ngOnInit() {
    this.initForm();
    this.filterData = this.data.filter;
    if (this.filterData) {
      this.formGroup?.patchValue(this.filterData);
    }
  }
  initForm() {
    this.formGroup = this._formBuilder.group({
      status: [null],
      startDate: [null],
      endDate: [null],
      createBy: [null],
      updateBy: [null],
    });
  }

  onSubmit() {
    this.filterData = {
      status: this.formGroup?.get("status")?.value ?? "",
      startDate: this.formGroup?.get("startDate")?.value ?? "",
      endDate: this.formGroup?.get("endDate")?.value ?? "",
      createBy: this.formGroup?.get("createBy")?.value ?? "",
      updateBy: this.formGroup?.get("updateBy")?.value ?? "",
    };
    this.dialogRef.close(this.filterData);
  }
  onClearData(): void {
    this.formGroup?.reset();
    this.data.filterCount = 0;
  }
}
