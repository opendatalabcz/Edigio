import {AbstractControl} from "@angular/forms";

export const validNamePartRegex = /^\p{L}+$/u

export function personNamePartValidator(control: AbstractControl) {
  return validNamePartRegex.test(control.value) ? null : {nameInvalid: true}
}

//Very simple phone number regex, allows lot of inputs, so it serves only as a hint
//Ignores empty value, therefor required validator should be added when needed
export const phoneNumberRegex = /^([+]?\d+)?$/

export function phoneNumberValidator(control: AbstractControl) {
  return phoneNumberRegex.test(control.value) ? null : {phoneNumberInvalid: true}
}
