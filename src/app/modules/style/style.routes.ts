import { Routes } from "@angular/router";

import { CreateComponent } from "@modules/style/pages/create/create.component";
import { DetailResolver } from "@modules/style/pages/detail/detail.resolver";
import { EditComponent } from "@modules/style/pages/edit/edit.component";
import { EditResolver } from "@modules/style/pages/edit/edit.resolver";
import { ListComponent } from "@modules/style/pages/list/list.component";
import { ListResolver } from "@modules/style/pages/list/list.resolver";

import { DetailComponent } from "./pages/detail/detail.component";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "แนวเพลง",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "แนวเพลง" }],
    },
  },
  {
    path: "create",
    component: CreateComponent,
    data: {
      title: "แนวเพลง",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "แนวเพลง", url: "style/list" },
        { title: "เพิ่มแนวเพลง" },
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
      title: "แนวเพลง",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "แนวเพลง", url: "style/list" },
        { title: "แก้ไขแนวเพลง" },
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
      title: "แนวเพลง",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "แนวเพลง", url: "style/list" },
        { title: "รายละเอียดแนวเพลง" },
      ],
    },
  },
] as Routes;
