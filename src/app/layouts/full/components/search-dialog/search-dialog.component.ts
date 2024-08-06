import { NgForOf } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";

import { sidebarItemConstants } from "@app/layouts/full/full.constants";

import { TablerIconsModule } from "angular-tabler-icons";

@Component({
  selector: "app-search-dialog",
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    NgForOf,
    RouterModule,
    TablerIconsModule,
  ],
  templateUrl: "search-dialog.component.html",
})
export class AppSearchDialogComponent {
  searchText = "";
  navItemsData = sidebarItemConstants.filter(sidebarItem => sidebarItem.displayName);
}
