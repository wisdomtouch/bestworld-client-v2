import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "@app/services/auth/auth.service";
import { AuthUtils } from "@app/shared/utils/auth.utils";

import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);
  if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
    req = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authService.accessToken),
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.signOut();
        router.navigateByUrl("sign-in");
      }

      return throwError(error);
    })
  );
};
