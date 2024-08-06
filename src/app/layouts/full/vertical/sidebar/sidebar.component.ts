import { NgIf, NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";

import { themeConstants } from "@app/layouts/full/full.constants";
import { OptionService } from "@app/services/option/option.service";
import { Option } from "@app/services/option/option.types";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [NgIf, NgOptimizedImage],
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent {
  option!: Option;

  constructor(private _optionService: OptionService) {
    this._optionService.option$.subscribe(value => {
      this.option = value;
    });
  }

  protected readonly themeConstants = themeConstants;
}
