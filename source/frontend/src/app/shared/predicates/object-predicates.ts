import {Nullable} from "../types/common";

export function isObjectNull<T>(obj?: Nullable<T>) : obj is null {
  return obj === null
}

export function isObjectNullOrUndefined(obj?: unknown | null) : obj is null | undefined {
  return obj === null || obj === undefined
}

export function isObjectNotNullOrUndefined<T>(obj?: T | null) : obj is Exclude<T, undefined | null> {
  return !isObjectNullOrUndefined(obj)
}
