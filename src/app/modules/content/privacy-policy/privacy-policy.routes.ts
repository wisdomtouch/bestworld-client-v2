import { Routes } from "@angular/router";

import { ListComponent } from "./page/list/list.component";
import { ListResolver } from "./resolver/list.resolver";

export default [
  {
    path: "",
    component: ListComponent,
    resolve: {
      createResolver: ListResolver,
    },
    data: {
      title: "Privacy policy",
      urls: [{ title: "Privacy policy" }],
    },
  },
] as Routes;
