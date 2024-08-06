import { CanActivateChildFn, CanActivateFn } from "@angular/router";

import { of } from "rxjs";

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = () => {
  //const router: Router = inject(Router);

  return of(true);
};
