import {AbstractControl} from "@angular/forms";
import {isObjectNullOrUndefined} from "../shared/predicates/object-predicates";

export const validNamePartRegex = /^\p{L}+$/u
export const FIRSTNAME_MAX_LENGTH: number = 255
export const LASTNAME_MAX_LENGTH: number = 255
export const EMAIL_MAX_LENGTH: number = 255
export const PHONE_NUMBER_MAX_LENGTH: number = 10

export function personNamePartValidator(control: AbstractControl) {
  return validNamePartRegex.test(control.value) ? null : {nameInvalid: true}
}

//Very simple phone number regex, allows lot of inputs, so it serves only as a hint
//Ignores empty value, therefor required validator should be added when needed
export const phoneNumberRegex = /^([+]?\d+)?$/

export function phoneNumberValidator(control: AbstractControl) {
  return isObjectNullOrUndefined(control.value) || phoneNumberRegex.test(control.value) ? null : {phoneNumberInvalid: true}
}
