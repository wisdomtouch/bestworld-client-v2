import { Routes } from "@angular/router";

import { CreateComponent } from "@modules/role/pages/create/create.component";
import { CreateResolver } from "@modules/role/pages/create/create.resolver";
import { DetailComponent } from "@modules/role/pages/detail/detail.component";
import { EditComponent } from "@modules/role/pages/edit/edit.component";
import { EditResolver } from "@modules/role/pages/edit/edit.resolver";
import { ListComponent } from "@modules/role/pages/list/list.component";
import { ListResolver } from "@modules/role/pages/list/list.resolver";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "ระดับแอดมิน",
      urls: [{ title: "การตั้งค่าทั่วไป" }, { title: "ระดับแอดมิน" }],
    },
  },
  {
    path: "create",
    component: CreateComponent,
    resolve: {
      createResolver: CreateResolver,
    },
    data: {
      title: "ระดับแอดมิน",
      urls: [
        { title: "การตั้งค่าทั่วไป" },
        { title: "ระดับแอดมิน", url: "/role/list" },
        { title: "เพิ่มระดับแอดมิน" },
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
      title: "ระดับแอดมิน",
      urls: [
        { title: "การตั้งค่าทั่วไป" },
        { title: "ระดับแอดมิน", url: "/role/list" },
        { title: "แก้ไขระดับแอดมิน" },
      ],
    },
  },
  {
    path: "detail/:id",
    component: DetailComponent,
    resolve: {
      createResolver: EditResolver,
    },
    data: {
      title: "ระดับแอดมิน",
      urls: [
        { title: "การตั้งค่าทั่วไป" },
        { title: "ระดับแอดมิน", url: "/role/list" },
        { title: "รายละเอียดระดับแอดมิน" },
      ],
    },
  },
] as Routes;
