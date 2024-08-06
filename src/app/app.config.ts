import { CommonModule } from "@angular/common";
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
} from "@angular/router";

import { MaterialModule } from "@app/shared/modules/material.module";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TablerIconsModule } from "angular-tabler-icons";
import * as TablerIcons from "angular-tabler-icons/icons";
import { NgScrollbarModule } from "ngx-scrollbar";
import { provideToastr } from "ngx-toastr";

import { appRoutes } from "./app.routes";
import { authInterceptor } from "./core/auth/guards/auth.interceptor";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideToastr(),
    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: "enabled" })
    ),
    importProvidersFrom(
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule,
      MatNativeDateModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};
