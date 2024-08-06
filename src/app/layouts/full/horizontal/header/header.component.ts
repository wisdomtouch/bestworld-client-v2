import { NgFor } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";

import {
  appConstants,
  languageConstants,
  notificationConstants,
  profileConstants,
  quickLinkConstants,
} from "@app/layouts/full/full.constants";
import { Language } from "@app/layouts/full/full.types";
import { SidebarComponent } from "@app/layouts/full/vertical/sidebar/sidebar.component";

import { TranslateService } from "@ngx-translate/core";
import { TablerIconsModule } from "angular-tabler-icons";

@Component({
  selector: "app-horizontal-header",
  standalone: true,
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    NgFor,
    RouterModule,
    SidebarComponent,
    TablerIconsModule,
  ],
  templateUrl: "./header.component.html",
})
export class AppHorizontalHeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  protected readonly quickLinkConstants = quickLinkConstants;
  protected readonly notificationConstants = notificationConstants;
  protected readonly appConstants = appConstants;
  protected readonly profileConstants = profileConstants;
  protected readonly languageConstants = languageConstants;
  selectedLanguage = languageConstants[0];

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    translate.setDefaultLang("en");
  }

  changeLanguage(language: Language): void {
    this.translate.use(language.code);
    this.selectedLanguage = language;
  }
}
