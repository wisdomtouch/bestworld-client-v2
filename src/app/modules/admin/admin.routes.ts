import { Routes } from "@angular/router";

import { CreateComponent } from "@modules/admin/pages/create/create.component";
import { CreateResolver } from "@modules/admin/pages/create/create.resolver";
import { DetailComponent } from "@modules/admin/pages/detail/detail.component";
import { DetailResolver } from "@modules/admin/pages/detail/detail.resolver";
import { EditComponent } from "@modules/admin/pages/edit/edit.component";
import { EditResolver } from "@modules/admin/pages/edit/edit.resolver";
import { ListComponent } from "@modules/admin/pages/list/list.component";
import { ListResolver } from "@modules/admin/pages/list/list.resolver";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "แอดมิน",
      urls: [{ title: "การจัดการผู้ใช้งาน" }, { title: "แอดมิน" }],
    },
  },
  {
    path: "create",
    component: CreateComponent,
    resolve: {
      createResolver: CreateResolver,
    },
    data: {
      title: "แอดมิน",
      urls: [
        { title: "การจัดการผู้ใช้งาน" },
        { title: "แอดมิน", url: "/admin/list" },
        { title: "เพิ่มแอดมิน" },
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
      title: "แอดมิน",
      urls: [
        { title: "การจัดการผู้ใช้งาน" },
        { title: "แอดมิน", url: "/admin/list" },
        { title: "แก้ไขแอดมิน" },
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
      title: "แอดมิน",
      urls: [
        { title: "การจัดการผู้ใช้งาน" },
        { title: "แอดมิน", url: "/admin/list" },
        { title: "รายละเอียดแอดมิน" },
      ],
    },
  },
] as Routes;
