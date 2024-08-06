import { Routes } from "@angular/router";

import { CreateComponent } from "@modules/album/pages/create/create.component";
import { CreateResolver } from "@modules/album/pages/create/create.resolver";
import { EditComponent } from "@modules/album/pages/edit/edit.component";
import { EditResolver } from "@modules/album/pages/edit/edit.resolver";
import { ListComponent } from "@modules/album/pages/list/list.component";
import { ListResolver } from "@modules/album/pages/list/list.resolver";

import { DetailComponent } from "./pages/detail/detail.component";
import { DetailResolver } from "./pages/detail/detail.resolver";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "อัลบั้ม",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "อัลบั้ม" }],
    },
  },
  {
    path: "create",
    component: CreateComponent,
    resolve: {
      createResolver: CreateResolver,
    },
    data: {
      title: "อัลบั้ม",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "อัลบั้ม", url: "album/list" },
        { title: "เพิ่มอัลบั้ม" },
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
      title: "อัลบั้ม",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "อัลบั้ม", url: "album/list" },
        { title: "แก้ไขอัลบั้ม" },
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
      title: "อัลบั้ม",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "อัลบั้ม ", url: "album/list" },
        { title: "รายละเอียดอัลบั้ม" },
      ],
    },
  },
] as Routes;
