import { NgIf } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";

import { colorThemeConstants, themeConstants } from "@app/layouts/full/full.constants";
import { OptionService } from "@app/services/option/option.service";
import { Option } from "@app/services/option/option.types";

import { TablerIconsModule } from "angular-tabler-icons";
import { NgScrollbarModule } from "ngx-scrollbar";

@Component({
  selector: "app-customizer",
  standalone: true,
  imports: [
    FormsModule,
    MatButtonToggleModule,
    MatListModule,
    MatTooltipModule,
    NgIf,
    NgScrollbarModule,
    TablerIconsModule,
  ],
  templateUrl: "./customizer.component.html",
  styleUrls: ["./customizer.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CustomizerComponent {
  option!: Option;

  constructor(private _optionService: OptionService) {
    this._optionService.option$.subscribe(value => {
      this.option = value;
    });
  }

  setOption() {
    this._optionService.setOption(this.option);
  }

  protected readonly themeConstants = themeConstants;
  protected readonly colorThemeConstants = colorThemeConstants;
}
