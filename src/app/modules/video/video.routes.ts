import { Routes } from "@angular/router";

import { CreateComponent } from "@modules/video/pages/create/create.component";
import { CreateResolver } from "@modules/video/pages/create/create.resolver";
import { DetailComponent } from "@modules/video/pages/detail/detail.component";
import { DetailResolver } from "@modules/video/pages/detail/detail.resolver";
import { EditComponent } from "@modules/video/pages/edit/edit.component";
import { EditResolver } from "@modules/video/pages/edit/edit.resolver";
import { ListComponent } from "@modules/video/pages/list/list.component";
import { ListResolver } from "@modules/video/pages/list/list.resolver";

import { StatisticComponent } from "./pages/statistic/statistic.component";
import { StatisticResolver } from "./pages/statistic/statistic.resolver";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "วิดีโอเพลง",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "วิดีโอเพลง" }],
    },
  },
  {
    path: "create",
    component: CreateComponent,
    resolve: {
      createResolver: CreateResolver,
    },
    data: {
      title: "วิดีโอเพลง",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "วิดีโอเพลง", url: "video/list" },
        { title: "เพิ่มวิดีโอเพลง" },
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
      title: "วิดีโอเพลง",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "วิดีโอเพลง", url: "video/list" },
        { title: "แก้ไขวิดีโอเพลง" },
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
      title: "วิดีโอเพลง",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "วิดีโอเพลง", url: "video/list" },
        { title: "รายละเอียดวิดีโอเพลง" },
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
      title: "Music Video Statistics",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "Music Video Statistics" }],
    },
  },
] as Routes;
