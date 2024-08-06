import { Routes } from "@angular/router";

import { CreateComponent } from "@modules/partner/pages/create/create.component";
import { DetailComponent } from "@modules/partner/pages/detail/detail.component";
import { DetailResolver } from "@modules/partner/pages/detail/detail.resolver";
import { EditComponent } from "@modules/partner/pages/edit/edit.component";
import { ListComponent } from "@modules/partner/pages/list/list.component";
import { ListResolver } from "@modules/partner/pages/list/list.resolver";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "พาร์ทเนอร์",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "พาร์ทเนอร์" }],
    },
  },
  {
    path: "create",
    component: CreateComponent,
    data: {
      title: "พาร์ทเนอร์",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "พาร์ทเนอร์", url: "partner/list" },
        { title: "เพิ่มพาร์ทเนอร์" },
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
      title: "พาร์ทเนอร์",
      urls: [
        { title: "การจัดการผู้ใช้งาน" },
        { title: "พาร์ทเนอร์", url: "partner/list" },
        { title: "รายละเอียดพาร์ทเนอร์" },
      ],
    },
  },
  {
    path: "edit/:id",
    component: EditComponent,
    resolve: {
      createResolver: DetailResolver,
    },
    data: {
      title: "พาร์ทเนอร์",
      urls: [
        { title: "การจัดการผู้ใช้งาน" },
        { title: "พาร์ทเนอร์", url: "partner/list" },
        { title: "แก้ไขพาร์ทเนอร์" },
      ],
    },
  },
] as Routes;
