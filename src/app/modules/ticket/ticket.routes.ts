import { DetailComponent } from "@modules/ticket/pages/detail/detail.component";
import { DetailResolver } from "@modules/ticket/pages/detail/detail.resolver";
import { ListComponent } from "@modules/ticket/pages/list/list.component";
import { ListResolver } from "@modules/ticket/pages/list/list.resolver";

export default [
  {
    path: "list",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "คำขอจากค่ายเพลง",
      urls: [{ title: "การจัดการผู้ใช้งาน" }, { title: "คำขอจากค่ายเพลง" }],
    },
  },
  {
    path: "detail/:id",
    component: DetailComponent,
    resolve: {
      createResolver: DetailResolver,
    },
    data: {
      title: "คำขอจากค่ายเพลง",
      urls: [
        { title: "การจัดการผู้ใช้งาน" },
        { title: "คำขอจากค่ายเพลง", url: "/ticket-request/list" },
      ],
    },
  },
];
