import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class ImageService {
  getImag(path: string) {
    return `${environment.apiUrl}/images/${path}`;
  }
}
