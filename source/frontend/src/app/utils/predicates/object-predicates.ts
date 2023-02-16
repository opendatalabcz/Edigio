import {Nullable} from "../types/common";

export function isNull<T>(obj?: Nullable<T>) : obj is T {
  return obj === null
}

export function isNullOrUndefined(obj?: unknown | null) : obj is null | undefined {
  return obj === null || obj === undefined
}

export function isNotNullOrUndefined<T>(obj?: T | null) : obj is Exclude<T, undefined | null> {
  return !isNullOrUndefined(obj)
}
