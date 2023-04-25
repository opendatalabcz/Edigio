import {isDefinedNotBlank} from "../predicates/string-predicates";

export function createAppendedErrorDescriptionString(description?: string) : string {
  return isDefinedNotBlank(description) ? `\nDescription: ${description}` : ''
}
