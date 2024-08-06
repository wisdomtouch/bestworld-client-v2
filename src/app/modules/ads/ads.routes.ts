import { Routes } from "@angular/router";

import { AdsBannerCreateComponent } from "@modules/ads/ads-images/pages/ads-banner/create/create.component";
import { AdsBannerDetailComponent } from "@modules/ads/ads-images/pages/ads-banner/detail/detail.component";
import { AdsBannerDetailResolver } from "@modules/ads/ads-images/pages/ads-banner/detail/detail.resolver";
import { AdsBannerEditComponent } from "@modules/ads/ads-images/pages/ads-banner/edit/edit.component";
import { AdsBannerEditResolver } from "@modules/ads/ads-images/pages/ads-banner/edit/edit.resolver";
import { AdsBannerListComponent } from "@modules/ads/ads-images/pages/ads-banner/list/list.component";
import { AdsBannerListResolver } from "@modules/ads/ads-images/pages/ads-banner/list/list.resolver";
import { MenuComponent } from "@modules/ads/ads-images/pages/menu/menu.component";
import { AdsVideoCreateComponent } from "@modules/ads/ads-videos/pages/create/create.component";
import { AdsVideoDetailComponent } from "@modules/ads/ads-videos/pages/detail/detail.component";
import { AdsVideoDetailResolver } from "@modules/ads/ads-videos/pages/detail/detail.resolver";
import { AdsVideoEditComponent } from "@modules/ads/ads-videos/pages/edit/edit.component";
import { AdsVideoEditResolver } from "@modules/ads/ads-videos/pages/edit/edit.resolver";
import { AdsVideoListComponent } from "@modules/ads/ads-videos/pages/list/list.component";
import { AdsVideoListResolver } from "@modules/ads/ads-videos/pages/list/list.resolver";

export default [
  {
    path: "ads-video/list",
    component: AdsVideoListComponent,
    resolve: {
      createResolver: AdsVideoListResolver,
    },
    data: {
      title: "วิดีโอโฆษณา",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "วิดีโอโฆษณา" }],
    },
  },
  {
    path: "ads-video/create",
    component: AdsVideoCreateComponent,
    data: {
      title: "เพิ่มวิดีโอโฆษณา",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "วิดีโอโฆษณา" },
        { title: "เพิ่มวิดีโอโฆษณา" },
      ],
    },
  },
  {
    path: "ads-video/detail/:id",
    component: AdsVideoDetailComponent,
    resolve: {
      createResolver: AdsVideoDetailResolver,
    },
    data: {
      title: "รายละเอียดโฆษณา",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "รายละเอียดสถิติโฆษณา", url: "/ads/ads-video/list" },
        { title: "รายละเอียดโฆษณา" },
      ],
    },
  },
  {
    path: "ads-video/edit/:id",
    component: AdsVideoEditComponent,
    resolve: {
      createResolver: AdsVideoEditResolver,
    },
    data: {
      title: "แก้ไขวิดีโอโฆษณา",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "วิดีโอโฆษณา", url: "ads/ads-video/list" },
        { title: "แก้ไขวิดีโอโฆษณา" },
      ],
    },
  },
  {
    path: "ads-image/menu",
    component: MenuComponent,
    data: {
      title: "แบนเนอร์โฆษณา",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "แบนเนอร์โฆษณา" }],
    },
  },
  {
    path: "ads-image/menu/:page/:position/list",
    component: AdsBannerListComponent,
    resolve: {
      createResolver: AdsBannerListResolver,
    },
  },
  {
    path: "ads-image/menu/:page/:position/create",
    component: AdsBannerCreateComponent,
  },
  {
    path: "ads-image/menu/:page/:position/detail/:id",
    component: AdsBannerDetailComponent,
    resolve: {
      createResolver: AdsBannerDetailResolver,
    },
    data: {
      title: "รายละเอียดโฆษณา",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "รายละเอียดสถิติโฆษณา", url: "ads-image/menu/:page/:position/list" },
        { title: "รายละเอียดโฆษณา" },
      ],
    },
  },
  {
    path: "ads-image/menu/:page/:position/edit/:id",
    component: AdsBannerEditComponent,
    resolve: {
      createResolver: AdsBannerEditResolver,
    },
  },
] as Routes;
