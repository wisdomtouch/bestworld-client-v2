/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "addComma", standalone: true })
export class AddCommaPipe implements PipeTransform {
  transform(input: any, decision = 0, defaultText = "0") {
    if (input || input === 0) {
      let parts = input.toString().replace(/[^-0-9.]+/g, "");
      parts = parts.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      parts[0] = parts[0] ? parts[0] : "0";
      if (parts.length >= 2) {
        if (parts[1].length >= decision) {
          parts[1] = parts[1].substring(0, decision);
        } else {
          parts[1] = parts[1].padEnd(decision, "0");
        }
      } else if (decision) {
        parts.push("0");
        parts[1] = parts[1].padEnd(decision, "0");
      }

      parts = parts.slice(0, 2);
      return parts.join(".");
    }
    return defaultText;
  }
}
