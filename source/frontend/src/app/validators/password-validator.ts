import {AbstractControl} from "@angular/forms";

const PASSWORD_REGEX: RegExp = /^[a-zA-Z0-9!"#$%&'()*+,-.\/:;<=>?@\[\]^_`{|}~\\]{8,64}$/

export function passwordValidator(control: AbstractControl) {
  return PASSWORD_REGEX.test(control.value) ? null : {passwordInvalid: true}
}


