import {isNotNullAndNotUndefined} from "./object-predicates";

export function isUnsignedInteger(value?: number) : boolean {
  return isNotNullAndNotUndefined(value) && Number.isInteger(value) && value! >= 0
}
