import {isArrayNullUndefinedOrEmpty} from "../array-utils";
import {Nullable} from "../types/common";

export function requireAll<T>(array: T[], predicate: (member: T) => boolean, description?: string): void {
  const invalidMembers = array.filter(value => !predicate(value))
  if (!isArrayNullUndefinedOrEmpty(invalidMembers)) {
    throw new Error(`Some members do not satisfy given predicate!\nDescription: "${description}"\nInvalid values:${invalidMembers}`)
  }
}

export function requireDefinedNotEmpty<T>(array?: Nullable<T[]>, description?: string): void {
  if (isArrayNullUndefinedOrEmpty(array)) {
    throw new Error(`Array is empty!\n${description}`)
  }
}
