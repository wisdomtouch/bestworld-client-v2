import { Routes } from "@angular/router";

import { CreateComponent } from "@modules/artist/pages/create/create.component";
import { CreateResolver } from "@modules/artist/pages/create/create.resolver";
import { DetailComponent } from "@modules/artist/pages/detail/detail.component";
import { DetailResolver } from "@modules/artist/pages/detail/detail.resolver";
import { EditComponent } from "@modules/artist/pages/edit/edit.component";
import { EditResolver } from "@modules/artist/pages/edit/edit.resolver";
import { ListComponent } from "@modules/artist/pages/list/list.component";
import { ListResolver } from "@modules/artist/pages/list/list.resolver";
import { StatisticComponent } from "@modules/artist/pages/statistic/statistic.component";
import { StatisticResolver } from "@modules/artist/pages/statistic/statistic.resolver";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "ศิลปิน",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "ศิลปิน" }],
    },
  },
  {
    path: "create",
    component: CreateComponent,
    resolve: {
      createResolver: CreateResolver,
    },
    data: {
      title: "ศิลปิน",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "ศิลปิน", url: "artist/list" },
        { title: "เพิ่มศิลปิน" },
      ],
    },
  },
  {
    path: "edit/:id",
    component: EditComponent,
    resolve: {
      createResolver: EditResolver,
    },
    data: {
      title: "ศิลปิน",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "ศิลปิน", url: "artist/list" },
        { title: "แก้ไขศิลปิน" },
      ],
    },
  },
  {
    path: "detail/:id",
    component: DetailComponent,
    resolve: {
      createResolver: DetailResolver,
    },
    data: {
      title: "ศิลปิน",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "ศิลปิน", url: "artist/list" },
        { title: "รายละเอียดศิลปิน" },
      ],
    },
  },
  {
    path: "statistic",
    component: StatisticComponent,
    resolve: {
      createResolver: StatisticResolver,
    },
    data: {
      title: "Artist Statistics",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "Artist Statistics" }],
    },
  },
] as Routes;
