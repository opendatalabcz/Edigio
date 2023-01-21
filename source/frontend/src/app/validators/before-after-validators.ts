import {AbstractControl} from "@angular/forms";
import {firstDateEarlierOrTheSameAsSecondDate} from "../utils/predicates/date-predicates";

function beforeAndAfterAreDefinedDates(after: any, before: any) {
  return (after instanceof Date) && (before instanceof Date)
}

export function beforeAfterValidator(afterDateControlKey: string, beforeDateControlKey: string, ruleKey: string) {
  return (control: AbstractControl) => {
    const afterDate = control.get(afterDateControlKey)?.value
    const beforeDate = control.get(beforeDateControlKey)?.value

    const isValid =
      !beforeAndAfterAreDefinedDates(afterDate, beforeDate) || firstDateEarlierOrTheSameAsSecondDate(afterDate, beforeDate)
    return isValid ? null : {[ruleKey]: true}
  }
}
