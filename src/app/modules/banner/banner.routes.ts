import { Routes } from "@angular/router";

import { CreateComponent } from "@modules/banner/pages/create/create.component";
import { DetailComponent } from "@modules/banner/pages/detail/detail.component";
import { DetailResolver } from "@modules/banner/pages/detail/detail.resolver";
import { EditComponent } from "@modules/banner/pages/edit/edit.component";
import { EditResolver } from "@modules/banner/pages/edit/edit.resolver";
import { ListComponent } from "@modules/banner/pages/list/list.component";
import { ListResolver } from "@modules/banner/pages/list/list.resolver";
import { OrderComponent } from "@modules/banner/pages/order/order.component";
import { OrderResolver } from "@modules/banner/pages/order/order.resolver";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "แบนเนอร์",
      urls: [{ title: "การจัดการเนื้อหา" }, { title: "แบนเนอร์" }],
    },
  },
  {
    path: "create",
    component: CreateComponent,
    data: {
      title: "แบนเนอร์",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "แบนเนอร์", url: "/banner/list" },
        { title: "เพิ่มแบนเนอร์" },
      ],
    },
  },
  {
    path: "order",
    component: OrderComponent,
    resolve: {
      moveResolver: OrderResolver,
    },
    data: {
      title: "แบนเนอร์",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "แบนเนอร์", url: "/banner/list" },
        { title: "จัดลำดับแบนเนอร์" },
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
      title: "แบนเนอร์",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "แบนเนอร์", url: "/banner/list" },
        { title: "รายละเอียดแบนเนอร์" },
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
      title: "แบนเนอร์",
      urls: [
        { title: "การจัดการเนื้อหา" },
        { title: "แบนเนอร์", url: "/banner/list" },
        { title: "แก้ไขแบนเนอร์" },
      ],
    },
  },
] as Routes;
