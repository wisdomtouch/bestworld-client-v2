import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { ChipStatusComponent } from "@app/shared/components/chip-status/chip-status.component";
import { chipColorConstants } from "@app/shared/constants/chip-color.constants";
import { MaterialModule } from "@app/shared/modules/material.module";

import { UserService } from "@services/users/users.service";
import { User } from "@services/users/users.type";

import { environment } from "@environments/environment";

import { TablerIconsModule } from "angular-tabler-icons";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-detail",
  standalone: true,
  imports: [
    AlertComponent,
    ChipStatusComponent,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent implements OnInit {
  constructor(
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  user?: User;
  private readonly unsubscribe$: Subject<void> = new Subject();
  urlImage = environment.apiUrl + "/images/";

  ngOnInit() {
    this._userService.userById$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.user = value;
      this._changeDetectorRef.markForCheck();
    });
  }

  protected readonly chipColorConstants = chipColorConstants;
}
