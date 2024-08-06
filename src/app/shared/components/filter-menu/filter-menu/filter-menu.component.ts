import { CommonModule, formatDate } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSelectChange } from "@angular/material/select";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { MaterialModule } from "@app/shared/modules/material.module";
import { FilterMenuData } from "@app/shared/types/shared.types";

import { AdminRoleOption } from "@services/option/option.types";

import { TablerIconsModule } from "angular-tabler-icons";

@Component({
  selector: "app-filter-menu",
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    DataNotFoundComponent,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./filter-menu.component.html",
})
export class FilterMenuComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder) {}
  formGroup?: FormGroup;
  clearChip?: Array<string>;
  maxDate?: Date;
  roleName?: string;
  roleId?: string;
  filteredItems?: AdminRoleOption[];

  @Output() selectStartDateEvent = new EventEmitter<string>();
  @Output() selectEndDateEvent = new EventEmitter<string>();
  @Output() filterCountEvent = new EventEmitter<number>();
  @Output() statusEvent = new EventEmitter<string>();
  @Output() createByEvent = new EventEmitter<string>();
  @Output() updateByEvent = new EventEmitter<string>();
  @Output() selectRoleEvent = new EventEmitter<{ roleId: string; roleName: string }>();
  @Output() clearEvent = new EventEmitter<string[]>();
  @Output() closeMenuEvent = new EventEmitter<void>();

  @Input() filterMenuData?: FilterMenuData;
  @Input() filterCount?: number;
  @Input() adminList?: AdminRoleOption[];
  @Input() menuTrigger?: MatMenuTrigger;

  ngOnInit() {
    this.initForm();
    this.filteredItems = this.adminList;
    const date = new Date();
    date.setFullYear(date.getFullYear() + 13);
    formatDate(date, "mm/dd/yyyy", "en-US");
    this.maxDate = date;
  }
  initForm() {
    this.formGroup = this._formBuilder.group({
      status: [null],
      startDate: [null],
      endDate: [null],
      createBy: [null],
      updateBy: [null],
      selectedRole: [null],
    });
    this.formGroup?.get("startDate")?.valueChanges.subscribe(value => {
      this.selectStartDateEvent.emit(value);
    });
    this.formGroup?.get("endDate")?.valueChanges.subscribe(value => {
      this.selectEndDateEvent.emit(value);
    });
    this.formGroup?.get("status")?.valueChanges.subscribe(value => {
      this.statusEvent.emit(value);
    });
    this.formGroup?.get("createBy")?.valueChanges.subscribe(value => {
      this.createByEvent.emit(value);
    });
    this.formGroup?.get("updateBy")?.valueChanges.subscribe(value => {
      this.updateByEvent.emit(value);
    });
  }
  selectedRole(selected: MatSelectChange) {
    this.roleId = selected.value;
    const filteredRoles = this.adminList?.filter(role => role.id === this.roleId);
    /* eslint-disable */
    if (filteredRoles!.length > 0) {
      this.roleName = filteredRoles![0]!.roleName; // eslint-disable-line
    } else {
      this.roleName = "";
    }
    this.selectRoleEvent.emit({ roleId: this.roleId!, roleName: this.roleName! });
  }
  /* eslint-disable */

  closeMenu() {
    this.closeMenuEvent.emit();
  }

  onClearData(): void {
    this.formGroup?.reset();
    this.filterCount = 0;
    this.filterCountEvent.emit(this.filterCount);
    this.clearChip = [];
    this.clearEvent.emit(this.clearChip);
  }
}
