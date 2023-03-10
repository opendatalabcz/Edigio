import {Nullable} from "../types/common";
import {anyMatch, isArrayEmpty} from "../array-utils";

/**
 * Check whether value is defined and not blank
 *
 * Note that this function might be a bit performance hungry,
 * it is recommended to use isDefinedNotEmpty whenever it is possible
 *
 * Return type doesn't describe 100% accurate what is being checked, but it was closest I could get
 *
 * @param value Value to be checked
 *
 * @return true when string is defined and not blank, false otherwise
 */
export function isDefinedNotBlank(value?: string | null) : value is Exclude<NonNullable<string>, ''> {
  return !!value && value.replaceAll(/\s/g,'').length > 0
}

/**
 * Check whether value is defined and not blank
 *
 * Return type doesn't describe 100% accurate what is being checked, but it was closest I could get
 *
 * @param value Value to be checked
 *
 * @return true when string is defined and not blank, false otherwise
 */
export function isDefinedNotEmpty(value?: Nullable<string>) : value is Exclude<string, ''> {
  return !!value
}
