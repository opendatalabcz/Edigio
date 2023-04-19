import {isArrayNullUndefinedOrEmpty} from "../utils/array-utils";
import {Nullable} from "../types/common";
import {createAppendedErrorDescriptionString} from "./common-assertions";

/**
 * Require all memebers of given array to be valid according to given predicate
 *
 * @param array Array of which members should be checked
 * @param predicate Predicate against which members should be tested
 * @param description Description of given check (part of eventual error message)
 */
export function requireAll<T>(array: T[], predicate: (member: T) => boolean, description?: string): T[] {
  const invalidMembers = array.filter(value => !predicate(value))
  if (!isArrayNullUndefinedOrEmpty(invalidMembers)) {
    const appendedDescription = createAppendedErrorDescriptionString(description)
    throw new Error(`Some members do not satisfy given predicate!${appendedDescription}\nInvalid values:${invalidMembers}`)
  }
  return array
}

/**
 * Require given array not to be undefined, null or empty
 *
 * @param array Array to check
 * @param description Description of why the check is done
 */
export function requireDefinedNotEmpty<T>(array?: Nullable<T[]>, description?: string): T[] {
  if (isArrayNullUndefinedOrEmpty(array)) {
    const appendedDescription = createAppendedErrorDescriptionString(description)
    throw new Error(`Array is empty!${appendedDescription}!`)
  }
  return array
}
