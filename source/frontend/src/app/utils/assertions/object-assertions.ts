import {isDefinedNotBlank} from "../predicates/string-predicates";
import {Nullable} from "../types/common";
import {isNull} from "../predicates/object-predicates";

export function requireType(value: any, type: string, description?: string) {
  if(typeof value !== type) {
    const appendedDescription = isDefinedNotBlank(description) ? `\nDescription: ${description}` : ''
    throw new Error(`Required ${type}, got ${typeof value}!${appendedDescription}`)
  }
}

export function requireNotNull<T>(value: Nullable<T>, description?: string) {
  if(isNull(value)) {
    const appendedDescription = isDefinedNotBlank(description) ? `\nDescription: ${description}` : ''
    throw new Error(`Required instance not to be null!${appendedDescription}`)
  }
}
