import { Component, Input, OnInit } from "@angular/core";

import { environment } from "@environments/environment";

@Component({
  selector: "app-play-ads-video",
  standalone: true,
  templateUrl: "./ads-video.component.html",
})
export class JwplayerComponent implements OnInit {
  @Input() video?: string;
  ngOnInit(): void {
    /* eslint-disable */
    // @ts-ignore
    jwplayer("player").setup({
      file: `${environment.streamAdsUrl}/${this.video}`,
      width: "100%",
      height: 650,
      aspectratio: "16:9",
      mute: false,
      autostart: false,
      skin: {
        controlBar: {
          background: "rgba(0,0,0,0)",
          icons: "rgba(255,255,255,0.8)",
          iconsActive: "#FFFFFF",
          text: "#FFFFFF",
        },
        menus: {
          background: "#333333",
          text: "rgba(255,255,255,0.8)",
          textActive: "#FFFFFF",
        },
        timeSlider: {
          progress: "#F2F2F2",
          rail: "rgba(255,255,255,0.3)",
        },
        tooltips: {
          background: "#FFFFFF",
          text: "#000000",
        },
      },
    });
  }
}
