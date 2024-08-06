/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { MaterialModule } from "@app/shared/modules/material.module";

import { StyleOption } from "@services/option/option.types";

import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TablerIconsModule } from "angular-tabler-icons";

export interface DialogData {
  styleOption: StyleOption[];
  styleName: Array<string>;
  styleId: Array<string>;
}

@Component({
  selector: "dialog-overview",
  templateUrl: "./show-style.component.html",
  styleUrls: ["./show-style.component.scss"],

  standalone: true,
  imports: [
    AlertComponent,
    CKEditorModule,
    CommonModule,
    DataNotFoundComponent,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
})
export class DialogStyleComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogStyleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  filteredItems?: StyleOption[];
  styleList?: StyleOption[];
  styleId?: Array<string> = [];
  styleName: Array<string> = [];

  ngOnInit(): void {
    this.styleList = this.data?.styleOption;
    this.filteredItems = this.data?.styleOption ?? null;
    this.styleName = this.data?.styleName;
    this.styleId = this.data?.styleId;
  }

  applyFilter(filterValue: string): void {
    if (filterValue) {
      this.filteredItems = this.styleList?.filter(item =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    } else {
      this.filteredItems = this.styleList;
    }
  }

  checkBox(val: string): boolean {
    const element = this.styleName?.find(item => item == val);
    if (element) {
      return true;
    }
    return false;
  }

  selectedRow(isChecked: MatCheckboxChange, val: StyleOption) {
    const element = this.styleName?.findIndex(item => item == val.name);
    if (isChecked.checked) {
      this.styleName?.push(val.name);
      this.styleId?.push(val.id);
    } else {
      this.styleName?.splice(element, 1);
      this.styleId?.splice(element, 1);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
