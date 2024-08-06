import { Routes } from "@angular/router";

import { DetailComponent } from "@modules/user/pages/detail/detail.component";
import { EditComponent } from "@modules/user/pages/edit/edit.component";
import { EditResolver } from "@modules/user/pages/edit/edit.resolver";

import { ListComponent } from "./pages/list/list.component";
import { ListResolver } from "./pages/list/list.resolver";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "สมาชิก",
      urls: [{ title: "การจัดการผู้ใช้งาน" }, { title: "สมาชิก" }],
    },
  },
  {
    path: "edit/:id",
    component: EditComponent,
    resolve: {
      createResolver: EditResolver,
    },
    data: {
      title: "สมาชิก",
      urls: [
        { title: "การจัดการผู้ใช้งาน" },
        { title: "สมาชิก", url: "/user/list" },
        { title: "แก้ไขสมาชิก" },
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
      title: "สมาชิก",
      urls: [
        { title: "การจัดการผู้ใช้งาน" },
        { title: "สมาชิก", url: "/user/list" },
        { title: "รายละเอียดสมาชิก" },
      ],
    },
  },
] as Routes;
