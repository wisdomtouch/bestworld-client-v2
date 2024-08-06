import { Component, Input, ViewEncapsulation } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

import { AlertTypes } from "./alert.types";

@Component({
  selector: "app-alert",
  standalone: true,
  imports: [MatCardModule],
  templateUrl: "./alert.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AlertComponent {
  @Input() color: AlertTypes = "primary";
}
