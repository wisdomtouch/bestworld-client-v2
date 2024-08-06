import { CommonModule, NgForOf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

import { NavItem } from "@app/layouts/full/full.types";

import { TablerIconsModule } from "angular-tabler-icons";

@Component({
  selector: "app-horizontal-nav-item",
  standalone: true,
  imports: [CommonModule, MatIconModule, NgForOf, TablerIconsModule],
  templateUrl: "./nav-item.component.html",
})
export class AppHorizontalNavItemComponent {
  @Input() depth = 0;
  @Input() navItem!: NavItem;

  constructor(public router: Router) {}

  onItemSelected(item: NavItem) {
    if (!item.children) {
      this.router.navigate([item.route]);
    }
  }
}
