import { NgForOf } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectionList, MatSelectionListChange } from "@angular/material/list";

import { MaterialModule } from "@app/shared/modules/material.module";
import { FilterSearchAdminRole } from "@app/shared/type/shared.types";

import { AdminRoleOption } from "@services/option/option.types";

export interface DialogData {
  adminRoleOption: AdminRoleOption[];
  roleName: Array<string>;
  roleId: string;
  filter: FilterSearchAdminRole;
}

@Component({
  selector: "app-show-admin-role",
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogActions,
    MatDialogContent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MaterialModule,
    NgForOf,
  ],
  templateUrl: "./show-admin-role.component.html",
  styleUrl: "./show-admin-role.component.scss",
})
export class ShowAdminRoleComponent implements OnInit {
  @ViewChild(MatSelectionList) selectionList: MatSelectionList | undefined;
  constructor(
    public dialogRef: MatDialogRef<ShowAdminRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  filterData?: FilterSearchAdminRole;
  filteredItems?: AdminRoleOption[];
  roleName: Array<string> = [];
  roleId?: string;
  ngOnInit(): void {
    this.filteredItems = this.data?.adminRoleOption ?? null;
  }

  selectedRow(selected: MatSelectionListChange) {
    this.roleId = selected.options[0]!.value; // eslint-disable-line
  }
  onSubmit() {
    this.filterData = {
      roleId: this.roleId!, // eslint-disable-line
    };
    this.dialogRef.close(this.filterData);
  }
  onClearData(): void {
    this.selectionList!.deselectAll(); // eslint-disable-line
  }
}
