import {
  isNotNullAndNotUndefined,
  isNullOrUndefined
} from "../utils/predicates/object-predicates";
import {encloseIfDefinedNotBlank} from "../utils/string-utils";

export class MaxLessThanMinError extends Error {
  constructor(min?: number, max?: number, subject?: string) {
    const commonPart = 'Minimum is greater than miximum!'
    const additionalPart = [
      isNotNullAndNotUndefined(min) ? `min: ${min}` : null,
      isNotNullAndNotUndefined(max) ? `max: ${max}` : null,
      isNotNullAndNotUndefined(subject) ? `subject: '${subject}'` : null
    ].filter(isNullOrUndefined).join(',')
    super(commonPart + encloseIfDefinedNotBlank(additionalPart, ' (', ')'))
  }
}
