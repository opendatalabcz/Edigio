import {isDefinedNotBlank} from "../predicates/string-predicates";

export function requireType(value: any, type: string, description?: string) {
  if(typeof value !== type) {
    const appendedDescription = isDefinedNotBlank(description) ? `\nDescription: ${description}` : ''
    throw new Error(`Required ${type}, got ${typeof value}!${appendedDescription}`)
  }
}
