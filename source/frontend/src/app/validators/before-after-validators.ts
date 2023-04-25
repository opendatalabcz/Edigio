import {AbstractControl} from "@angular/forms";
import {firstDateEarlierOrTheSameAsSecondDate} from "../shared/predicates/date-predicates";
import {relationalBinaryValidator} from "./relational-validators";

function beforeAndAfterAreDefinedDates(after: any, before: any) {
  return (after instanceof Date) && (before instanceof Date)
}

function beforeAfterValidatorOperator(afterControl: AbstractControl, beforeControl: AbstractControl) {
  return !beforeAndAfterAreDefinedDates(afterControl.value, beforeControl.value)
    || firstDateEarlierOrTheSameAsSecondDate(afterControl.value, beforeControl.value);
}

export function beforeAfterValidator(afterDateControlKey: string, beforeDateControlKey: string, ruleKey: string) {
  return relationalBinaryValidator(afterDateControlKey, beforeDateControlKey, beforeAfterValidatorOperator, ruleKey)
}
