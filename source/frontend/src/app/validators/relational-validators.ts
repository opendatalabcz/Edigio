import {AbstractControl, ValidationErrors} from "@angular/forms";
import {isUndefined} from "@ngx-formly/core/lib/utils";

function bothFieldsDefined(firstControl?: AbstractControl, secondControl?: AbstractControl) {
  return (firstControl && secondControl)
}

/**
 * Validator that checks relation between two controls, sets or unsets error on second control,
 * and returns ValidationError object or null when field is valid.
 *
 * Example usage: {@link beforeAfterValidator}
 *
 * @param firstControlKey Control with first value ("left side")
 * @param secondControlKey Control with first value ("right side")
 * @param operator Operator that returns true when field is valid and false when field is invalid
 * @param ruleKey Key of error that will be returned in error object and also set to second control
 */
export function relationalBinaryValidator(
  firstControlKey: string,
  secondControlKey: string,
  operator: (firstControl: AbstractControl, secondControl: AbstractControl) => boolean,
  ruleKey: string,
  ignoreUndefinedFields = true
) : (control: AbstractControl) => (ValidationErrors | null) {
  return (control: AbstractControl) => {
    const firstControl = control.get(firstControlKey)
    const secondControl = control.get(secondControlKey)
    const isValid =  (ignoreUndefinedFields && (!firstControl || !secondControl))
      || (firstControl && secondControl && operator(firstControl, secondControl))
    if(!isValid && secondControl) {
      secondControl.setErrors({...secondControl.errors, [ruleKey]: true})
    } else if(secondControl && secondControl.hasError(ruleKey)) {
      const errorsCopy = {...secondControl.errors}
      delete errorsCopy[ruleKey]
      const finalState = Object.keys(errorsCopy).length > 0 ? errorsCopy : null
      secondControl.setErrors(finalState)
    }
    return isValid ? null : {[ruleKey]: true}
  }
}
