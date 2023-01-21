import {isBefore, isEqual} from "date-fns";


export function firstDateEarlierOrTheSameAsSecondDate(first: Date, second: Date) {
  return isBefore(first, second) || isEqual(first, second)
}
