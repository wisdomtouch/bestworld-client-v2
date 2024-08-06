import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "@services/auth/auth.service";

@Component({
  selector: "app-logout",
  standalone: true,
  template: ``,
  imports: [],
})
export class LogoutComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._authService.signOut().subscribe(value => {
      if (value) {
        this._router.navigate(["sign-in"]).then(() => {
          window.location.reload();
        });
      }
    });
  }
}
