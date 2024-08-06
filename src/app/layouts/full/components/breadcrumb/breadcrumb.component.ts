/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgForOf, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Data, NavigationEnd, Router, RouterModule } from "@angular/router";

import { filter, map, mergeMap } from "rxjs/operators";

@Component({
  selector: "app-breadcrumb",
  standalone: true,
  imports: [NgForOf, NgIf, RouterModule],
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"],
})
export class AppBreadcrumbComponent {
  pageInfo: Data = Object.create(null);
  id!: string;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _titleService: Title
  ) {
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this._activatedRoute))
      .pipe(
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          route.params.subscribe((params: any) => {
            this.id = params.id;
          });
          return route;
        })
      )
      .pipe(filter(route => route.outlet === "primary"))
      .pipe(mergeMap(route => route.data))
      .subscribe(event => {
        this._titleService.setTitle(event["title"]);
        this.pageInfo = event;

        const url = this._router.url;
        if (url.includes("ads/ads-image")) {
          this.mapBreadcrumbAdsList(url);
          this.mapBreadcrumbAdsCreate(url);
          this.mapBreadcrumbAdsDetail(url);
          this.mapBreadcrumbAdsDetailEdit(url);
        }
      });
  }
  mapBreadcrumbAdsList(url: string) {
    const pathInfo = url.split("menu/")[1];
    switch (pathInfo) {
      case "home/home-banner/list":
        this._titleService.setTitle("หน้าแรก - แบนเนอร์โฆษณา");
        this.pageInfo["title"] = "หน้าแรก - แบนเนอร์โฆษณา";
        this.pageInfo["urls"] = [{ title: "การจัดการเนื้อหา" }, { title: "หน้าแรก-แบนเนอร์โฆษณา" }];
        break;
      case "home/home-between-new-music/list":
        this._titleService.setTitle("หน้าแรก - ระหว่างรายการเพลงใหม่");
        this.pageInfo["title"] = "หน้าแรก - ระหว่างรายการเพลงใหม่";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "หน้าแรก - ระหว่างรายการเพลงใหม่" },
        ];
        break;
      case "home/home-bottom/list":
        this._titleService.setTitle("หน้าแรก - ด้านล่าง");
        this.pageInfo["title"] = "หน้าแรก - ด้านล่าง";
        this.pageInfo["urls"] = [{ title: "การจัดการเนื้อหา" }, { title: "หน้าแรก - ด้านล่าง" }];
        break;
      case "search/search-recommend-music/list":
        this._titleService.setTitle("หน้าค้นหา - ระหว่างรายการเพลงแนะนำ");
        this.pageInfo["title"] = "หน้าค้นหา - ระหว่างรายการเพลงแนะนำ";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "หน้าค้นหา - ระหว่างรายการเพลงแนะนำ" },
        ];
        break;
      case "playlist/playlist-recommend-bottom/list":
        this._titleService.setTitle("หน้าเพลย์ลิสต์ - เพลย์ลิสแนะนำด้านล่าง");
        this.pageInfo["title"] = "หน้าเพลย์ลิสต์ - เพลย์ลิสแนะนำด้านล่าง";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "หน้าเพลย์ลิสต์ - เพลย์ลิสแนะนำด้านล่าง" },
        ];
        break;
      case "playlist/playlist-bottom/list":
        this._titleService.setTitle("หน้าเพลย์ลิสต์ - ด้านล่าง");
        this.pageInfo["title"] = "หน้าเพลย์ลิสต์ - ด้านล่าง";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "หน้าเพลย์ลิสต์ - ด้านล่าง" },
        ];
        break;
      case "playlist/playlist-right/list":
        this._titleService.setTitle("หน้าเพลย์ลิสต์ - ด้านขวา");
        this.pageInfo["title"] = "หน้าเพลย์ลิสต์ - ด้านขวา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "หน้าเพลย์ลิสต์ - ด้านขวา" },
        ];
        break;
      case "artist/artist-top-hit-bottom/list":
        this._titleService.setTitle("หน้าศิลปิน - ศิลปินยอดนิยมด้านล่าง");
        this.pageInfo["title"] = "หน้าศิลปิน - ศิลปินยอดนิยมด้านล่าง";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "หน้าศิลปิน - ศิลปินยอดนิยมด้านล่าง" },
        ];
        break;
      case "artist/artist-all-bottom/list":
        this._titleService.setTitle("หน้าศิลปิน - ศิลปินรวมด้านล่าง");
        this.pageInfo["title"] = "หน้าศิลปิน - ศิลปินรวมด้านล่าง";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "หน้าศิลปิน - ศิลปินรวมด้านล่าง" },
        ];
        break;
      case "artist/artist-bottom/list":
        this._titleService.setTitle("หน้าศิลปิน - ด้านล่าง");
        this.pageInfo["title"] = "หน้าศิลปิน - ด้านล่าง";
        this.pageInfo["urls"] = [{ title: "การจัดการเนื้อหา" }, { title: "หน้าศิลปิน - ด้านล่าง" }];
        break;
      case "album/album-bottom/list":
        this._titleService.setTitle("หน้าอัลบั้ม - ด้านล่าง");
        this.pageInfo["title"] = "หน้าอัลบั้ม - ด้านล่าง";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "หน้าอัลบั้ม - ด้านล่าง" },
        ];
        break;
      case "karaoke/karaoke-bottom/list":
        this._titleService.setTitle("หน้าคาราโอเกะ - ด้านล่าง");
        this.pageInfo["title"] = "หน้าคาราโอเกะ - ด้านล่าง";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "หน้าคาราโอเกะ - ด้านล่าง" },
        ];
        break;
      case "field-search/field-search-home/list":
        this._titleService.setTitle("ในช่องค้นหา - หน้าแรก");
        this.pageInfo["title"] = "ในช่องค้นหา - หน้าแรก";
        this.pageInfo["urls"] = [{ title: "การจัดการเนื้อหา" }, { title: "ในช่องค้นหา - หน้าแรก" }];
        break;
      case "field-search/field-search-karaoke/list":
        this._titleService.setTitle("ในช่องค้นหา - หน้าคาราโอเกะ");
        this.pageInfo["title"] = "ในช่องค้นหา - หน้าคาราโอเกะ";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "ในช่องค้นหา - หน้าคาราโอเกะ" },
        ];
        break;
    }
  }
  mapBreadcrumbAdsCreate(url: string) {
    const pathInfo = url.split("menu/")[1];
    switch (pathInfo) {
      case "home/home-banner/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าแรก - แบนเนอร์โฆษณา");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าแรก - แบนเนอร์โฆษณา" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "home/home-between-new-music/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าแรก - ระหว่างรายการเพลงใหม่");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าแรก - ระหว่างรายการเพลงใหม่" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "home/home-bottom/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าแรก - ด้านล่าง");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าแรก - ด้านล่าง" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "search/search-recommend-music/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าค้นหา - ระหว่างรายการเพลงแนะนำ");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าค้นหา - ระหว่างรายการเพลงแนะนำ" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "playlist/playlist-recommend-bottom/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าเพลย์ลิสต์ - เพลย์ลิสแนะนำด้านล่าง");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าเพลย์ลิสต์ - เพลย์ลิสแนะนำด้านล่าง" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "playlist/playlist-bottom/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าเพลย์ลิสต์ - ด้านล่าง");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าเพลย์ลิสต์ - ด้านล่าง" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "playlist/playlist-right/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าเพลย์ลิสต์ - ด้านขวา");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าเพลย์ลิสต์ - ด้านขวา" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "artist/artist-top-hit-bottom/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าศิลปิน - ศิลปินยอดนิยมด้านล่าง");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าศิลปิน - ศิลปินยอดนิยมด้านล่าง" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "artist/artist-all-bottom/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าศิลปิน - ศิลปินรวมด้านล่าง");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าศิลปิน -ศิลปินรวมด้านล่าง" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "artist/artist-bottom/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าศิลปิน - ด้านล่าง");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าศิลปิน - ด้านล่าง" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "album/album-bottom/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าอัลบั้ม - ด้านล่าง");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าอัลบั้ม - ด้านล่าง" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "karaoke/karaoke-bottom/create":
        this._titleService.setTitle("เพิ่มโฆษณา - หน้าคาราโอเกะ - ด้านล่าง");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าคาราโอเกะ - ด้านล่าง" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "field-search/field-search-home/create":
        this._titleService.setTitle("เพิ่มโฆษณา - ในช่องค้นหา - หน้าแรก");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "ในช่องค้นหา - หน้าแรก" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
      case "field-search/field-search-karaoke/create":
        this._titleService.setTitle("เพิ่มโฆษณา - ในช่องค้นหา - หน้าคาราโอเกะ");
        this.pageInfo["title"] = "เพิ่มโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "ในช่องค้นหา - หน้าคาราโอเกะ" },
          { title: "เพิ่มโฆษณา" },
        ];
        break;
    }
  }
  mapBreadcrumbAdsDetail(url: string) {
    const pathInfo = url.split("menu/")[1];
    const pathInfoDetail = pathInfo!.split("/").slice(0, 3).join("/"); // eslint-disable-line
    switch (pathInfoDetail) {
      case "home/home-banner/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าแรก - แบนเนอร์โฆษณา" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "home/home-between-new-music/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา่");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าแรก - ระหว่างรายการเพลงใหม่" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "home/home-bottom/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าแรก - ด้านล่าง" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "search/search-recommend-music/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าค้นหา - ระหว่างรายการเพลงแนะนำ" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "playlist/playlist-recommend-bottom/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าเพลย์ลิสต์ - เพลย์ลิสแนะนำด้านล่าง" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "playlist/playlist-bottom/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าเพลย์ลิสต์ - ด้านล่าง" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "playlist/playlist-right/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าเพลย์ลิสต์ - ด้านขวา" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "artist/artist-top-hit-bottom/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าศิลปิน - ศิลปินยอดนิยมด้านล่าง" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "artist/artist-all-bottom/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าศิลปิน -ศิลปินรวมด้านล่าง" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "artist/artist-bottom/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าศิลปิน - ด้านล่าง" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "album/album-bottom/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าอัลบั้ม - ด้านล่าง" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "karaoke/karaoke-bottom/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าคาราโอเกะ - ด้านล่าง" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "field-search/field-search-home/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "ในช่องค้นหา - หน้าแรก" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
      case "field-search/field-search-karaoke/detail":
        this._titleService.setTitle("รายละเอียดโฆษณา");
        this.pageInfo["title"] = "รายละเอียดโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "ในช่องค้นหา - หน้าคาราโอเกะ" },
          { title: "รายละเอียดโฆษณา" },
        ];
        break;
    }
  }
  mapBreadcrumbAdsDetailEdit(url: string) {
    const pathInfo = url.split("menu/")[1];
    const pathInfoDetail = pathInfo!.split("/").slice(0, 3).join("/"); // eslint-disable-line
    switch (pathInfoDetail) {
      case "home/home-banner/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าแรก - แบนเนอร์โฆษณา" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "home/home-between-new-music/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าแรก - ระหว่างรายการเพลงใหม่" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "home/home-bottom/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าแรก - ด้านล่าง" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "search/search-recommend-music/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าค้นหา - ระหว่างรายการเพลงแนะนำ" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "playlist/playlist-recommend-bottom/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าเพลย์ลิสต์ - เพลย์ลิสแนะนำด้านล่าง" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "playlist/playlist-bottom/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าเพลย์ลิสต์ - ด้านล่าง" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "playlist/playlist-right/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าเพลย์ลิสต์ - ด้านขวา" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "artist/artist-top-hit-bottom/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าศิลปิน - ศิลปินยอดนิยมด้านล่าง" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "artist/artist-all-bottom/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าศิลปิน -ศิลปินรวมด้านล่าง" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "artist/artist-bottom/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าศิลปิน - ด้านล่าง" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "album/album-bottom/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าอัลบั้ม - ด้านล่าง" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "karaoke/karaoke-bottom/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "หน้าคาราโอเกะ - ด้านล่าง" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "field-search/field-search-home/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "ในช่องค้นหา - หน้าแรก" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
      case "field-search/field-search-karaoke/edit":
        this._titleService.setTitle("แก้ไขโฆษณา");
        this.pageInfo["title"] = "แก้ไขโฆษณา";
        this.pageInfo["urls"] = [
          { title: "การจัดการเนื้อหา" },
          { title: "แบนเนอร์โฆษณา" },
          { title: "ในช่องค้นหา - หน้าคาราโอเกะ" },
          { title: "แก้ไขโฆษณา" },
        ];
        break;
    }
  }
}
