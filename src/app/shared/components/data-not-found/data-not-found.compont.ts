import { Component, OnChanges, SimpleChanges } from "@angular/core";

import { TablerIconsModule } from "angular-tabler-icons";

@Component({
  selector: "app-data-not-found",
  templateUrl: "./data-not-found.compont.html",
  standalone: true,
  imports: [TablerIconsModule],
})
export class DataNotFoundComponent implements OnChanges {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(_changes: SimpleChanges): void {
    throw new Error("Method not implemented.");
  }
}
