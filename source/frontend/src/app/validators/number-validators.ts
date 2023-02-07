import {AbstractControl} from "@angular/forms";

export const integerRegex = /^[+-]?\d+$/u

export function integerValidator(control: AbstractControl) {
  return integerRegex.test(control.value) ? null : {integer: true}
}
