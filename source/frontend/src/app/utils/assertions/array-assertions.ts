import {isArrayNullUndefinedOrEmpty} from "../array-utils";
import {Nullable} from "../types/common";
import {isDefinedNotBlank} from "../predicates/string-predicates";

export function requireAll<T>(array: T[], predicate: (member: T) => boolean, description?: string): void {
  const invalidMembers = array.filter(value => !predicate(value))
  if (!isArrayNullUndefinedOrEmpty(invalidMembers)) {
    const appendedDescription = isDefinedNotBlank(description) ? `\nDescription: ${description}` : ''
    throw new Error(`Some members do not satisfy given predicate!${appendedDescription}\nInvalid values:${invalidMembers}`)
  }
}

export function requireDefinedNotEmpty<T>(array?: Nullable<T[]>, description?: string): void {
  if (isArrayNullUndefinedOrEmpty(array)) {
    const appendedDescription = isDefinedNotBlank(description) ? `\nDescription: ${description}` : ''
    throw new Error(`Array is empty!${appendedDescription}`)
  }
}
