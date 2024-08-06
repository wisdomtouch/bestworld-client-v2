import { FormGroup } from "@angular/forms";
import { AbstractControl, ValidatorFn } from "@angular/forms";

import moment from "moment";

export function dateFormat(date: moment.MomentInput) {
  return moment(date).format("DD/MM/yyyy");
}
export function dateFormatNoTime(date: moment.MomentInput) {
  return moment(date).format("DD/MM/yyyy");
}

export function genTime(date: Date) {
  const now = new Date(date);
  now.setHours(now.getHours() + 7);
  return now;
}

export function confirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl?.errors && !matchingControl?.errors["confirmedValidator"]) {
      return;
    }
    if (control?.value !== matchingControl?.value) {
      matchingControl?.setErrors({ confirmedValidator: true });
    } else {
      matchingControl?.setErrors(null);
    }
  };
}

export function checkNumValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl?.errors && !matchingControl?.errors["checkNumValidator"]) {
      return;
    }
    if (parseFloat(control?.value) > parseFloat(matchingControl?.value)) {
      matchingControl?.setErrors({ checkNumValidator: true });
    } else {
      matchingControl?.setErrors(null);
    }
  };
}

// Custom validator function for the "word-word-word" pattern
export function slugValidator(): ValidatorFn {
  // Regular expression pattern for the "word-word-word" format
  const slugPattern = /^$|([a-z0-9]+-)*[a-z0-9]+$/;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    // Check if the control value matches the slug pattern
    if (!slugPattern.test(value)) {
      return { invalidSlug: true };
    }

    return null;
  };
}

export function generateRandomString(length: number): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
