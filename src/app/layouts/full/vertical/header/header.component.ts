import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";

import { AppSearchDialogComponent } from "@app/layouts/full/components/search-dialog/search-dialog.component";
import {
  appConstants,
  languageConstants,
  notificationConstants,
  profileConstants,
  quickLinkConstants,
} from "@app/layouts/full/full.constants";
import { Language } from "@app/layouts/full/full.types";

import { TranslateService } from "@ngx-translate/core";
import { TablerIconsModule } from "angular-tabler-icons";
import { NgScrollbarModule } from "ngx-scrollbar";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatToolbarModule,
    NgScrollbarModule,
    RouterModule,
    TablerIconsModule,
  ],
  templateUrl: "./header.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav: EventEmitter<void> = new EventEmitter<void>();
  @Output() toggleMobileFilterNav: EventEmitter<void> = new EventEmitter<void>();
  @Output() toggleCollapsed: EventEmitter<void> = new EventEmitter<void>();
  protected readonly languageConstants = languageConstants;
  protected readonly appConstants = appConstants;
  selectedLanguage = languageConstants[0];

  constructor(
    private _translateService: TranslateService,
    public dialog: MatDialog
  ) {
    _translateService.setDefaultLang("en");
  }

  openDialog() {
    const dialogRef = this.dialog.open(AppSearchDialogComponent);
    dialogRef.afterClosed().subscribe();
  }

  changeLanguage(language: Language): void {
    this._translateService.use(language.code);
    this.selectedLanguage = language;
  }

  protected readonly quickLinkConstants = quickLinkConstants;
  protected readonly notificationConstants = notificationConstants;
  protected readonly profileConstants = profileConstants;
}
