import { Route } from "@angular/router";

import { initialDataResolver } from "./app.resolvers";
import { AuthGuard } from "./core/auth/guards/auth.guard";
import { NoAuthGuard } from "./core/auth/guards/no-auth.guard";
import { BlankComponent } from "./layouts/blank/blank.component";
import { FullComponent } from "./layouts/full/full.component";

export const appRoutes: Route[] = [
  // Redirect
  { path: "", pathMatch: "full", redirectTo: "admin/list" },

  // Auth Routes For Guests
  {
    path: "",
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    resolve: {
      initialData: initialDataResolver,
    },
    component: BlankComponent,
    children: [
      {
        path: "sign-in",
        loadChildren: () => import("./modules/authentication/pages/login/login.routes"),
      },
    ],
  },
  {
    path: "",
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve: {
      initialData: initialDataResolver,
    },
    component: FullComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () => import("@modules/dashboard/dashboard.routes"),
      },
      {
        path: "admin",
        loadChildren: () => import("@modules/admin/admin.routes"),
      },
      {
        path: "style",
        loadChildren: () => import("@modules/style/style.routes"),
      },
      {
        path: "artist",
        loadChildren: () => import("@modules/artist/artist.routes"),
      },
      {
        path: "album",
        loadChildren: () => import("@modules/album/album.routes"),
      },
      {
        path: "role",
        loadChildren: () => import("@modules/role/role.routes"),
      },
      {
        path: "video",
        loadChildren: () => import("@modules/video/video.routes"),
      },
      {
        path: "cookies-policy",
        loadChildren: () => import("@modules/content/cookies-policy/cookies-policy.routes"),
      },
      {
        path: "privacy-policy",
        loadChildren: () => import("@modules/content/privacy-policy/privacy-policy.routes"),
      },
      {
        path: "term-of-use",
        loadChildren: () => import("@modules/content/term-of-use/term-of-use.routes"),
      },
      {
        path: "user",
        loadChildren: () => import("@modules/user/user.routes"),
      },
      {
        path: "playlist",
        loadChildren: () => import("@modules/playlist/playlist.routes"),
      },
      {
        path: "banner",
        loadChildren: () => import("@modules/banner/banner.routes"),
      },
      {
        path: "ads",
        loadChildren: () => import("@modules/ads/ads.routes"),
      },
      {
        path: "partner",
        loadChildren: () => import("./modules/partner/partner.routes"),
      },
      {
        path: "ticket-requests",
        loadChildren: () => import("./modules/ticket/ticket.routes"),
      },
    ],
  },
  {
    path: "logout",
    pathMatch: "full",
    loadChildren: () => import("@modules/authentication/pages/logout/logout.routes"),
  },

  { path: "**", redirectTo: "error" },
];
