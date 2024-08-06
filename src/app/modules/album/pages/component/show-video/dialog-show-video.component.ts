/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { paginationOption } from "@app/shared/constants/pagination.constant";
import { MaterialModule } from "@app/shared/modules/material.module";

import { OptionService } from "@services/option/option.service";
import { Video, VideoPagination } from "@services/videos/videos.type";

import { environment } from "@environments/environment";

import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TablerIconsModule } from "angular-tabler-icons";
import { Subject, debounceTime, merge, switchMap, takeUntil } from "rxjs";

export interface DialogData {
  musicId: Array<Video>;
  artistId: string;
}

@Component({
  selector: "dialog-overview",
  templateUrl: "./dialog-show-video.component.html",
  styleUrls: ["./dialog-show-video.component.scss"],

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
export class DialogVideoComponent implements OnInit, AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<DialogVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _optionService: OptionService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  videoPagination!: VideoPagination;
  videoDisplayColumns: string[] = ["no", "name", "createdBy", "duration"];
  urlImage = environment.apiUrl + "/images/";
  private readonly unsubscribe$: Subject<void> = new Subject();
  @ViewChild(MatPaginator) _matPaginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort) _matSort: MatSort = Object.create(null);

  searchInput: FormControl = new FormControl("");
  protected readonly paginationOption = paginationOption;
  ngOnInit(): void {
    this._optionService.videoOption$.pipe(takeUntil(this.unsubscribe$)).subscribe((value): void => {
      this.videoPagination = value;
      this._changeDetectorRef.markForCheck();
    });
  }

  checkBox(val: string): boolean {
    const element = this.data.musicId?.find(item => item.id == val);
    if (element) {
      return true;
    }
    return false;
  }

  ngAfterViewInit(): void {
    merge(this._matSort.sortChange, this._matPaginator.page, this.searchInput.valueChanges)
      .pipe(
        debounceTime(500),
        switchMap(() => {
          return this._optionService.getVideoOptionByArtist(
            this.data.artistId,
            this._matPaginator.pageIndex,
            this._matPaginator.pageSize,
            this._matSort.active,
            this._matSort.direction,
            this.searchInput.value
          );
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  selectedRow(isChecked: MatCheckboxChange, val: Video) {
    const element = this.data.musicId.findIndex(item => item.id == val.id);
    if (isChecked.checked) {
      this.data.musicId.push(val);
    } else {
      this.data.musicId.splice(element, 1);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
