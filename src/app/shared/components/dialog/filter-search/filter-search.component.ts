import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { MaterialModule } from "@app/shared/modules/material.module";
import { FilterSearch } from "@app/shared/type/shared.types";

import { AlertComponent } from "@components/alert/alert.component";

import { TablerIconsModule } from "angular-tabler-icons";

export interface DialogData {
  isStatus: boolean;
  isDate: boolean;
  isName: boolean;
  filter: FilterSearch;
}
@Component({
  selector: "app-filter-search",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    DataNotFoundComponent,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./filter-search.component.html",
  styleUrl: "./filter-search.component.scss",
})
export class FilterSearchComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<FilterSearchComponent>,
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
  }
}
