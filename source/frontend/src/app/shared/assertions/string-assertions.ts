import {Nullable} from "../types/common";
import {createAppendedErrorDescriptionString} from "./common-assertions";
import {isDefinedNotBlank} from "../predicates/string-predicates";

/**
 * Require given string not to be undefined, null or blank
 *
 * @param value string to check
 * @param description Description of why the check is done
 */
export function requireStringDefinedNotBlank<T>(value?: Nullable<string>, description?: string): Exclude<string, ''> {
  if (!isDefinedNotBlank(value)) {
    const appendedDescription = createAppendedErrorDescriptionString(description)
    throw new Error(`String is undefined, null, or blank! ${appendedDescription}!`)
  }
  return value
}
