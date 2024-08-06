import { animate, state, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { Router } from "@angular/router";

import { NavItem } from "@app/layouts/full/full.types";

import { TranslateModule } from "@ngx-translate/core";
import { TablerIconsModule } from "angular-tabler-icons";

@Component({
  selector: "app-nav-item",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, TablerIconsModule, TranslateModule],
  templateUrl: "./nav-item.component.html",
  styleUrls: [],
  animations: [
    trigger("indicatorRotate", [
      state("collapsed", style({ transform: "rotate(0deg)" })),
      state("expanded", style({ transform: "rotate(180deg)" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4,0.0,0.2,1)")),
    ]),
  ],
})
export class AppNavItemComponent {
  @Output() toggleMobileLink = new EventEmitter<void>();
  @Output() notify = new EventEmitter<boolean>();
  isExpanded = false;
  @HostBinding("attr.aria-expanded") ariaExpanded = this.isExpanded;
  @Input() navItem!: NavItem;
  @Input() depth = 0;

  constructor(public router: Router) {}

  onItemSelected(item: NavItem) {
    if (!item.children) {
      this.router.navigate([item.route]);
    } else {
      this.isExpanded = !this.isExpanded;
    }

    //Scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    if (!this.isExpanded) {
      if (window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }

  onSubItemSelected(item: NavItem) {
    if (!item.children) {
      if (this.isExpanded && window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }
}
