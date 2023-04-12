import {AbstractControl} from "@angular/forms";
import {isObjectNullOrUndefined} from "../utils/predicates/object-predicates";

export const validNamePartRegex = /^\p{L}+$/u

export function personNamePartValidator(control: AbstractControl) {
  return validNamePartRegex.test(control.value) ? null : {nameInvalid: true}
}

//Very simple phone number regex, allows lot of inputs, so it serves only as a hint
//Ignores empty value, therefor required validator should be added when needed
export const phoneNumberRegex = /^([+]?\d+)?$/

export function phoneNumberValidator(control: AbstractControl) {
  return isObjectNullOrUndefined(control.value) || phoneNumberRegex.test(control.value) ? null : {phoneNumberInvalid: true}
}
