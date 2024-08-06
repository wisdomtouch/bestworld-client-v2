import { Routes } from "@angular/router";

import { CreateComponent } from "@modules/playlist/pages/create/create.component";
import { CreateResolver } from "@modules/playlist/pages/create/create.resolver";
import { DetailComponent } from "@modules/playlist/pages/detail/detail.component";
import { DetailResolver } from "@modules/playlist/pages/detail/detail.resolver";
import { EditComponent } from "@modules/playlist/pages/edit/edit.component";
import { EditResolver } from "@modules/playlist/pages/edit/edit.resolver";
import { ListComponent } from "@modules/playlist/pages/list/list.component";
import { ListResolver } from "@modules/playlist/pages/list/list.resolver";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "เพลย์ลิสต์",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "เพลย์ลิสต์" }],
    },
  },
  {
    path: "create",
    component: CreateComponent,
    resolve: {
      createResolver: CreateResolver,
    },
    data: {
      title: "เพลย์ลิสต์",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "เพลย์ลิสต์", url: "playlist/list" },
        { title: "เพิ่มเพลย์ลิสต์" },
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
      title: "เพลย์ลิสต์",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "เพลย์ลิสต์", url: "playlist/list" },
        { title: "แก้ไขเพลย์ลิสต์" },
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
      title: "เพลย์ลิสต์",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "เพลย์ลิสต์ ", url: "playlist/list" },
        { title: "รายละเอียดเพลย์ลิสต์" },
      ],
    },
  },
] as Routes;
