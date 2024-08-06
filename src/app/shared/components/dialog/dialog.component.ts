import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: "app-dialog",
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],

  templateUrl: "./dialog.component.html",
})
export class AppDialogComponent {
  @Input() tiltle!: string;
  @Input() subTiltle!: string;
  @Input() cancel!: string;
  @Input() done!: string;
  constructor(public _dialog: MatDialog) {}
  onNoClick(): void {
    this._dialog.closeAll();
  }
}
