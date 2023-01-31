export function isArrayNullUndefinedOrEmpty(array?: unknown[] | null) : array is [] | null | undefined {
  return array === undefined || array === null || isArrayEmpty(array)
}

export function isArrayEmpty(array: unknown[]) : array is [] {
  return array.length === 0
}
