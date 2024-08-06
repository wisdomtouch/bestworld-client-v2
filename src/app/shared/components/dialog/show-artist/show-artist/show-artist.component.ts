import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { DataNotFoundComponent } from "@app/shared/components/data-not-found/data-not-found.compont";
import { MaterialModule } from "@app/shared/modules/material.module";

import { ArtistsOption } from "@services/option/option.types";

import { environment } from "@environments/environment";

import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TablerIconsModule } from "angular-tabler-icons";

export interface DialogData {
  artistOption: ArtistsOption[];
  artistName: string;
  artistId: string;
}
@Component({
  selector: "app-show-artist",
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
  templateUrl: "./show-artist.component.html",
  styleUrl: "./show-artist.component.scss",
})
export class DialogShowArtistComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogShowArtistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  filteredItems?: ArtistsOption[];
  artistList?: ArtistsOption[];
  artistId?: string = "";
  artistName?: string;
  urlImage = environment.apiUrl + "/images/";

  ngOnInit(): void {
    this.artistList = this.data?.artistOption;
    this.filteredItems = this.data?.artistOption;
    this.artistName = this.data?.artistName;
    this.artistId = this.data?.artistId;
  }

  applyFilter(filterValue: string): void {
    if (filterValue) {
      this.filteredItems = this.artistList?.filter(item =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    } else {
      this.filteredItems = this.artistList;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
