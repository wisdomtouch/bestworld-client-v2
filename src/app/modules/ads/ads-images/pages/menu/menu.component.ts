import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

import { MaterialModule } from "@app/shared/modules/material.module";

import { TablerIconsModule } from "angular-tabler-icons";

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MaterialModule, TablerIconsModule],
  templateUrl: "./menu.component.html",
  styleUrl: "./menu.component.scss",
})
export class MenuComponent {
  constructor() {
    this.showClick = 1;
  }
  showClick?: number;
  selectHome() {
    this.showClick = 1;
  }
  selectSearch() {
    this.showClick = 2;
  }
  selectPlaylist() {
    this.showClick = 3;
  }
  selectArtist() {
    this.showClick = 4;
  }
  selectAlbum() {
    this.showClick = 5;
  }
  selectKaraoke() {
    this.showClick = 6;
  }
  selectFieldSearch() {
    this.showClick = 7;
  }
}
