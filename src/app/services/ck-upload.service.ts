/* eslint-disable @typescript-eslint/no-explicit-any */
import { localStorageConstants } from "@app/shared/constants/local-storage.constants";

import { environment } from "@environments/environment";

export class CkUploadAdapter {
  loader: any;
  xhr!: XMLHttpRequest;
  type: string;
  uid: string;

  constructor(loader: any, type: string, uid: string) {
    this.loader = loader;
    this.type = type;
    this.uid = uid;
  }

  get accessToken(): string {
    return localStorage.getItem(localStorageConstants.AUTH_ACCESS_TOKEN) ?? "";
  }
  upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open("POST", `${environment.apiUrl}/admin/images/${this.type}/${this.uid}`, true);

    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${this.accessToken}`);
  }

  _initListeners(resolve: any, reject: any, file: File) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;
    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const response = xhr.response;
      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }
      resolve({
        default: `${environment.apiUrl}/${response.path}`,
      });
    });
    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt: any) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file: any) {
    const data = new FormData();
    data.append("file", file);
    this.xhr.send(data);
  }
}
