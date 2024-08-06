/* eslint-disable @angular-eslint/component-selector */
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

export interface DialogData {
  url: string;
  position: string;
  fileSizeDesktop: number;
  fileSizeMobile: number;
  isClick: number;
}

@Component({
  selector: "dialog-overview",
  templateUrl: "./dialog-show-image.component.html",
  styleUrls: ["./dialog-show-image.component.scss"],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class DialogImgUrlComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogImgUrlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
