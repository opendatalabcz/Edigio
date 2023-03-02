import {AbstractControl} from "@angular/forms";
import {isArrayNullUndefinedOrEmpty} from "../utils/array-utils";

const NOT_BLANK_STRING_REGEX: RegExp = /^.*[^\s]+.*$/g


export const NOT_BLANK_STRING_ERROR_KEY: string = 'blankString'

export function createNotBlankStringValidator(control: AbstractControl<string>): null | {[errorKey: string]: true} {
  const value = control.value
  const isValid : boolean = !isArrayNullUndefinedOrEmpty(value.match(NOT_BLANK_STRING_REGEX));
  return isValid ? null : {[NOT_BLANK_STRING_ERROR_KEY]: true}
}


