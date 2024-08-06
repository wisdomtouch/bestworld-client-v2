import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

import { themeConstants } from "@app/layouts/full/full.constants";
import { AuthService } from "@app/services/auth/auth.service";
import { SignInRequest } from "@app/services/auth/auth.types";
import { OptionService } from "@app/services/option/option.service";
import { Option } from "@app/services/option/option.types";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { Constant } from "@app/shared/constants/constant";
import { ErrorUtils } from "@app/shared/utils/error.utils";

import { environment } from "@environments/environment";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    AlertComponent,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  option!: Option;
  loginForm!: FormGroup;
  isShowAlertError = false;
  alertError = "";
  isSubmitForm = false;
  protected readonly themeConstants = themeConstants;

  constructor(
    private _optionService: OptionService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _errorPipe: ErrorUtils
  ) {}

  ngOnInit() {
    this._optionService.option$.subscribe(value => {
      this.option = value;
    });
    if (environment.production) {
      this.loginForm = this._formBuilder.group({
        username: ["", [Validators.required]],
        password: ["", Validators.required],
      });
    } else {
      this.loginForm = this._formBuilder.group({
        username: ["info@ketube.com", [Validators.required]],
        password: ["1234@ErK", Validators.required],
      });
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  loginAdmin(): void {
    this.isSubmitForm = true;
    if (this.loginForm.invalid) {
      for (const control of Object.keys(this.loginForm.controls)) {
        this.loginForm.controls[control]?.markAsTouched();
      }
      return;
    }

    this.loginForm.disable();
    this.isShowAlertError = false;

    const signInRequest = {
      email: this.loginForm.get("username")?.value,
      password: this.loginForm.get("password")?.value,
    } as SignInRequest;

    this._authService.signIn(signInRequest).subscribe({
      next: this._handleSignInNext,
      error: this._handleSignInError,
    });
  }

  private _handleSignInNext = () => {
    localStorage.setItem(Constant.accessUser, this.loginForm.get("username")?.value);
    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get("redirectURL") || "";
    this._router.navigateByUrl(redirectURL);
  };

  private _handleSignInError = (err: HttpErrorResponse) => {
    this.loginForm.enable();
    this.isShowAlertError = true;
    const message = this._errorPipe.transform(err.error.message);
    this.alertError = message;
  };
}
