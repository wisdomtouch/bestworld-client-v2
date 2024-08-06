import { inject } from "@angular/core";

import { OptionService } from "@app/services/option/option.service";

import { AuthService } from "@services/auth/auth.service";
import { NavigatorService } from "@services/navigators/navigators.service";

import { forkJoin } from "rxjs";

export const initialDataResolver = () => {
  const navigatorService = inject(NavigatorService);
  const optionService = inject(OptionService);
  const authService = inject(AuthService);
  let sourceList: any = [optionService.getOption()]; // eslint-disable-line

  if (authService.accessToken) {
    sourceList = [...sourceList, navigatorService.getNavigator()];
  }

  return forkJoin(sourceList);
};
