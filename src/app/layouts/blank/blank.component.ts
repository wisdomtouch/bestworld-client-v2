import { DOCUMENT, NgClass } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { colorThemeConstants, themeConstants } from "@app/layouts/full/full.constants";
import { OptionService } from "@app/services/option/option.service";
import { Option } from "@app/services/option/option.types";
import { MaterialModule } from "@app/shared/modules/material.module";

@Component({
  selector: "app-blank",
  standalone: true,
  imports: [MaterialModule, NgClass, RouterOutlet],
  templateUrl: "./blank.component.html",
  styleUrls: [],
})
export class BlankComponent {
  private _htmlElement: HTMLHtmlElement | null = null;
  public option!: Option;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _optionService: OptionService
  ) {
    this._optionService.option$.subscribe(value => {
      this.option = value;
      this._htmlElement = this._document.querySelector("html");
      this.toggleDarkTheme(this.option);
    });
  }

  toggleDarkTheme(value: Option) {
    if (value.theme === themeConstants.DARK_THEME) {
      this._htmlElement?.classList.add(themeConstants.DARK_THEME_CLASS);
      this._htmlElement?.classList.remove(themeConstants.LIGHT_THEME_CLASS);
    } else {
      this._htmlElement?.classList.remove(themeConstants.DARK_THEME_CLASS);
      this._htmlElement?.classList.add(themeConstants.LIGHT_THEME_CLASS);
    }
  }

  protected readonly colorThemeConstants = colorThemeConstants;
}
