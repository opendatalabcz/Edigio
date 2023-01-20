import {AbstractControl} from "@angular/forms";

export const validNamePartRegex = /^\p{L}+$/u

export function personNamePartValidator(control: AbstractControl) {
  return validNamePartRegex.test(control.value) ? null : {nameInvalid: true}
}

export const phoneNumberRegex = /^[+]?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4,6}$/

export function phoneNumberValidator(control: AbstractControl) {
  return phoneNumberRegex.test(control.value) ? null : {phoneNumberInvalid: true}
}
