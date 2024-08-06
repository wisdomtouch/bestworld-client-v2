import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";

import { AuthService } from "@services/auth/auth.service";

import { of, switchMap } from "rxjs";

export const AuthGuard: CanActivateFn | CanActivateChildFn = (_, state) => {
  const router: Router = inject(Router);

  return inject(AuthService)
    .checkAuthenticate()
    .pipe(
      switchMap(value => {
        if (!value) {
          const redirectURL = state.url === "/sign-out" ? "" : `redirectURL=${state.url}`;
          const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

          return of(urlTree);
        }

        return of(true);
      })
    );
};
