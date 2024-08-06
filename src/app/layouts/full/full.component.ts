import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatSidenav, MatSidenavContent } from "@angular/material/sidenav";
import { NavigationEnd, Router, RouterModule } from "@angular/router";

import {
  appConstants,
  colorThemeConstants,
  navItemHorizontalConstants,
  quickLinkConstants,
  screenViewConstants,
  themeConstants,
} from "@app/layouts/full/full.constants";
import { NavigatorService } from "@app/services/navigators/navigators.service";
import { Navigators } from "@app/services/navigators/navigators.type";
import { OptionService } from "@app/services/option/option.service";
import { Option } from "@app/services/option/option.types";
import { MaterialModule } from "@app/shared/modules/material.module";

import { AppBreadcrumbComponent } from "@layouts/full/components/breadcrumb/breadcrumb.component";
import { CustomizerComponent } from "@layouts/full/components/customizer/customizer.component";
import { AppHorizontalHeaderComponent } from "@layouts/full/horizontal/header/header.component";
import { AppHorizontalSidebarComponent } from "@layouts/full/horizontal/sidebar/sidebar.component";
import { HeaderComponent } from "@layouts/full/vertical/header/header.component";
import { AppNavItemComponent } from "@layouts/full/vertical/nav-item/nav-item.component";
import { SidebarComponent } from "@layouts/full/vertical/sidebar/sidebar.component";

import { TablerIconsModule } from "angular-tabler-icons";
import { NgScrollbarModule } from "ngx-scrollbar";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-full",
  standalone: true,
  imports: [
    AppBreadcrumbComponent,
    AppHorizontalHeaderComponent,
    AppHorizontalSidebarComponent,
    AppNavItemComponent,
    CommonModule,
    CustomizerComponent,
    HeaderComponent,
    MaterialModule,
    NgScrollbarModule,
    RouterModule,
    SidebarComponent,
    TablerIconsModule,
  ],
  templateUrl: "./full.component.html",
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class FullComponent implements OnDestroy, OnInit {
  @ViewChild("sidebarNav")
  matSidenav!: MatSidenav;
  @ViewChild("contentWrapper", { static: true })
  matSidenavContent!: MatSidenavContent;

  private _layoutChangesSubscription = Subscription.EMPTY;
  private _isMobileScreen = false;
  private _htmlElement: HTMLHtmlElement | null = null;
  public option!: Option;
  public isResponsiveView = false;
  username!: string;

  navItemVerticalConstants!: Navigators;

  protected readonly quickLinkConstants = quickLinkConstants;
  protected readonly appConstants = appConstants;
  protected readonly colorThemeConstants = colorThemeConstants;

  get isModeSide(): boolean {
    return this._isMobileScreen;
  }

  get isTabletSize(): boolean {
    return this.isResponsiveView;
  }

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _optionService: OptionService,
    private _router: Router,
    private _breakpointObserver: BreakpointObserver,
    private _navigatorService: NavigatorService
  ) {
    this.username = "username" ?? "";
    this._optionService.option$.subscribe(value => {
      this.option = value;
      this.toggleDarkTheme(value);
    });

    this._layoutChangesSubscription = this._breakpointObserver
      .observe([
        screenViewConstants.MOBILE_VIEW,
        screenViewConstants.TABLET_VIEW,
        screenViewConstants.MONITOR_VIEW,
        screenViewConstants.BELOW_MONITOR,
      ])
      .subscribe(value => {
        this.option.sidenavOpened = true;
        this._isMobileScreen = value.breakpoints[screenViewConstants.MOBILE_VIEW] ?? false;
        if (!this.option.sidenavCollapsed) {
          this.option.sidenavCollapsed =
            value.breakpoints[screenViewConstants.TABLET_VIEW] ?? false;
        }
        this.isResponsiveView = value.breakpoints[screenViewConstants.BELOW_MONITOR] ?? false;
      });

    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.matSidenavContent?.scrollTo({ top: 0 });
    });
  }
  ngOnInit() {
    this._navigatorService.navigator$.subscribe((result: Navigators) => {
      this.navItemVerticalConstants = result;
    });
  }
  ngOnDestroy() {
    this._layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.option.sidenavCollapsed = !this.option.sidenavCollapsed;
    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) {
    setTimeout(() => {
      this._optionService.setOption(this.option);
    }, timer);
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.option.sidenavOpened = isOpened;
    this._optionService.setOption(this.option);
  }

  toggleDarkTheme(value: Option) {
    this._htmlElement = this._document.querySelector("html");
    if (value.theme === themeConstants.DARK_THEME) {
      this._htmlElement?.classList.add(themeConstants.DARK_THEME_CLASS);
      this._htmlElement?.classList.remove(themeConstants.LIGHT_THEME_CLASS);
    } else {
      this._htmlElement?.classList.remove(themeConstants.DARK_THEME_CLASS);
      this._htmlElement?.classList.add(themeConstants.LIGHT_THEME_CLASS);
    }
  }

  protected readonly themeConstants = themeConstants;
  protected readonly navItemHorizontalConstants = navItemHorizontalConstants;
}
