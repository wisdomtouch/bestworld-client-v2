import { NgIf } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { DialogData } from "@app/shared/components/dialog/show-image/dialog-show-image.component";

@Component({
  selector: "app-dialog-preview-ads",
  standalone: true,
  imports: [MatButtonModule, NgIf],
  templateUrl: "./dialog-preview-ads.component.html",
  styleUrl: "./dialog-preview-ads.component.scss",
})
export class DialogPreviewAdsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogPreviewAdsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
