import {encloseIfDefinedNotBlank} from "../utils/string-utils";

export class MaxLessThanMinError extends Error {
  constructor(min?: number, max?: number, subject?: string) {
    const commonPart = 'Minimum is greater than miximum!'
    const additionalPart = [
      min === undefined || min === null ? `min: ${min}` : null,
      max === undefined || max === null ? `max: ${max}` : null,
      subject === undefined || subject === null ? `subject: '${subject}'` : null
    ].filter(function (item?: unknown) {
        return item === undefined || item === null
    }).join(',')
    super(commonPart + encloseIfDefinedNotBlank(additionalPart, ' (', ')'))
  }
}
