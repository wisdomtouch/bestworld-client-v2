/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgIf } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";

import { CkUploadAdapter } from "@app/services/ck-upload.service";
import { ContentService } from "@app/services/content/content.service";
import { ContentRequest } from "@app/services/content/content.type";
import { NavigatorService } from "@app/services/navigators/navigators.service";
import { Navigators, Permission } from "@app/services/navigators/navigators.type";
import { LoadingComponent } from "@app/shared/components/loading/loading.component";
import { TableComponent } from "@app/shared/components/table/table.component";
import { PermissionEnum } from "@app/shared/enums/permission.enum";
import { ErrorUtils } from "@app/shared/utils/error.utils";

import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { TablerIconsModule } from "angular-tabler-icons";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";
import { uid } from "uid";

@Component({
  selector: "app-list-term-of-use",
  standalone: true,
  imports: [
    CKEditorModule,
    LoadingComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    NgIf,
    RouterModule,
    TableComponent,
    TablerIconsModule,
  ],
  templateUrl: "./list.component.html",
  styleUrls: [],
})
export class ListComponent implements OnInit {
  Editor = DecoupledEditor;
  private _unsubscribeAll = new Subject();
  public editorConfig: any = {
    enterMode: "br",
    link: { addTargetToExternalLinks: true },
  };
  isDelete? = true;
  isEdit? = true;
  isCreate? = true;
  isSubmit = false;
  uid = uid(32);
  navigator!: Navigators;
  permission?: Permission;

  menu = PermissionEnum;
  description!: string;
  descriptionUpdate!: string;
  contentRequest!: ContentRequest;

  constructor(
    private _contentService: ContentService,
    private _errorPipe: ErrorUtils,
    private _toastr: ToastrService,
    private _navigatorService: NavigatorService
  ) {}

  ngOnInit(): void {
    this._navigatorService.navigator$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value): void => {
        this.navigator = value;
        this.permission = this.navigator.permission.find(x => x.menu === this.menu.Content);
        this.isDelete = this.permission?.isDelete;
        this.isEdit = this.permission?.isUpdate;
        this.isCreate = this.permission?.isCreate;
      });

    this._contentService.contentTermOfUse$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value): void => {
        this.descriptionUpdate = value.content;
      });
  }

  public onReady(editor: any): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return new CkUploadAdapter(loader, "blog", this.uid);
    };
  }

  public onChangeDescription(editor: any) {
    this.description = editor.editor?.getData();
  }

  updatePolicy() {
    this.isSubmit = true;
    this.contentRequest = {
      type: "TermOfUse",
      content: this.description,
    } as ContentRequest;
    this._contentService.updateContent(this.contentRequest).subscribe({
      next: () => {
        this._contentService.getTermOfUse().subscribe();
        this._toastr.success("Success", "Save success");
        this.isSubmit = false;
      },
      error: (err: HttpErrorResponse) => {
        const message = this._errorPipe.transform(err.error.message);
        this._toastr.error(message);
        this.isSubmit = false;
      },
    });
  }
}
