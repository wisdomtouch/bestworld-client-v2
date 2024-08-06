import { CommonModule, NgFor } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
// import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";

import { AddCommaPipe } from "@app/shared/pipe/add-comma.pipe";

import { TablerIconsModule } from "angular-tabler-icons";

import { DataNotFoundComponent } from "../data-not-found/data-not-found.compont";
import { AppDialogComponent } from "../dialog/dialog.component";
import { DialogImgUrlComponent } from "../dialog/show-image/dialog-show-image.component";
import { ColumnTable } from "./column-table";

export interface PeriodicElement {
  id: number;
  imagePath: string;
  uname: string;
  position: string;
  productName: string;
  budget: number;
  priority: string;
}
@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  standalone: true,
  imports: [
    AddCommaPipe,
    CommonModule,
    DataNotFoundComponent,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgFor,
    ReactiveFormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  styleUrls: ["./table.component.scss"],
})
export class TableComponent<T> implements OnChanges, OnInit {
  @Input() tableColumns: Array<ColumnTable> = [];
  @Input() tableData?: Array<T> = [];
  @Input() isPost!: boolean;
  @Input() isDelete!: boolean;
  @Input() isView!: boolean;
  @Input() isEdit!: boolean;
  @Input() size!: number;
  @Input() page!: number;
  @Input() length?: number;

  @Output() editMethod = new EventEmitter<{
    id: string;
  }>();

  @Output() deleteMethod = new EventEmitter<{
    id: string;
  }>();

  @Output() sortDataMethod = new EventEmitter<{
    active: string;
    direction: string;
  }>();

  @Output() toggleMenuOut = new EventEmitter<{
    id: number;
    value: boolean;
    type: number;
  }>();

  @Output() getPage = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();

  @Output() selectCheckbox = new EventEmitter<{
    id: string;
    checked: boolean;
  }>();

  @Output() goTo = new EventEmitter<{
    id: string;
  }>();

  displayedColumns: Array<string> = [];
  dataSource: MatTableDataSource<T> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;
  @ViewChild("empTbSort") empTbSort = new MatSort();
  @ViewChild(MatPaginator) private _paginator!: MatPaginator;

  constructor(public _dialog: MatDialog) {}

  ngOnInit() {
    this.matSort.sort({
      id: "updatedAt",
      start: "desc",
      disableClear: true,
    });
  }

  ngOnChanges(): void {
    this.displayedColumns = this.tableColumns.map(c => c.columnDef);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.matSort;
  }

  sortData(sort: Sort) {
    this.sortDataMethod.emit({
      active: sort.active,
      direction: sort.direction,
    });
  }
  getPages() {
    if (this.matSort && this._paginator) {
      this.getPage.emit({
        pageIndex: this._paginator.pageIndex,
        pageSize: this._paginator.pageSize,
      });
    }
  }

  openDialog(action: string, id: string): void {
    if (action == "Update") {
      this.editMethod.emit({ id: id });
    } else {
      const dialogRef = this._dialog.open(AppDialogComponent);
      dialogRef.componentInstance.tiltle = "Delete";
      dialogRef.componentInstance.subTiltle = "Would you like to delete data?";
      dialogRef.componentInstance.cancel = "Cancel";
      dialogRef.componentInstance.done = "Ok";
      dialogRef.afterClosed().subscribe(value => {
        if (value == "OK") {
          this.deleteMethod.emit({ id: id });
        }
      });
    }
  }

  zoomImage(url: string): void {
    this._dialog.open(DialogImgUrlComponent, {
      data: {
        url: url,
      },
      panelClass: "bg-color",
    });
  }

  no(val: number) {
    return this.page * this.size + 1 + val;
  }

  selectedRow(isChecked: MatCheckboxChange, id: string) {
    this.selectCheckbox.emit({
      id: id,
      checked: isChecked.checked,
    });
  }

  onGoto(id: string): void {
    this.goTo.emit({ id: id });
  }
}
