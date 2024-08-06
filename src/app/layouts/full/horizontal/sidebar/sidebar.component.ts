import { MediaMatcher } from "@angular/cdk/layout";
import { NgForOf, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { Router } from "@angular/router";

import { navItemHorizontalConstants } from "@app/layouts/full/full.constants";
import { AppHorizontalNavItemComponent } from "@app/layouts/full/horizontal/nav-item/nav-item.component";

@Component({
  selector: "app-horizontal-sidebar",
  standalone: true,
  imports: [AppHorizontalNavItemComponent, NgForOf, NgIf],
  templateUrl: "./sidebar.component.html",
})
export class AppHorizontalSidebarComponent {
  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor(
    public router: Router,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia("(min-width: 1100px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  protected readonly navItemHorizontalConstants = navItemHorizontalConstants;
}
