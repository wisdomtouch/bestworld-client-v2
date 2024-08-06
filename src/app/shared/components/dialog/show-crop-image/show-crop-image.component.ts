import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";

import { FilterSearch } from "@app/shared/types/shared.types";

import { TablerIconsModule } from "angular-tabler-icons";
import { ImageCroppedEvent, ImageCropperComponent } from "ngx-image-cropper";

export interface DialogData {
  isStatus: boolean;
  isDate: boolean;
  isName: boolean;
  filter: FilterSearch;
}
export type CropperDialogData = {
  image: File;
  width: number;
  height: number;
};

export type CropperDialogResult = {
  blob: Blob;
  imageUrl: string;
};
@Component({
  selector: "app-show-crop-image",
  standalone: true,
  imports: [
    CommonModule,
    ImageCropperComponent,
    MatButtonModule,
    MatDialogModule,
    TablerIconsModule,
  ],
  templateUrl: "./show-crop-image.component.html",
  styleUrls: ["./show-crop-image.component.scss"],
})
export class ShowCropImageComponent {
  data: CropperDialogData = inject(MAT_DIALOG_DATA);
  result = signal<CropperDialogResult | undefined>(undefined);

  imageCropped(event: ImageCroppedEvent) {
    const { blob, objectUrl } = event;
    if (blob && objectUrl) {
      this.result.set({ blob, imageUrl: objectUrl });
    }
  }
}
