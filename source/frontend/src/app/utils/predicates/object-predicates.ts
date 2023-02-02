export function isNullOrUndefined(obj?: unknown | null) : obj is null | undefined {
  return obj === null || obj === undefined
}

export function isNotNullOrUndefined<T>(obj?: T | null) : obj is Exclude<T, undefined | null> {
  return !isNullOrUndefined(obj)
}
