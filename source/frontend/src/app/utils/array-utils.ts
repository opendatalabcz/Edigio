export function isArrayNullUndefinedOrEmpty(array?: unknown[] | null) : array is [] | null | undefined {
  return array === undefined || array === null || isArrayEmpty(array)
}

export function isArrayEmpty(array: unknown[]) : array is [] {
  return array.length === 0
}

export function containsAll<T>(subj: readonly T[], items: readonly T[]) {
  return items.findIndex((item) => !subj.includes(item)) < 0
}

export function containsAny<T>(subj: readonly T[], items: readonly T[]) {
  return items.findIndex(item => subj.includes(item)) >= 0
}

export function cartesianProduct<T, U>(first: readonly T[], second: readonly U[]) : [T,U][] {
  return first.flatMap(
    (firstArrayItem) => second.map(secondArrayItem => <[T,U]>[firstArrayItem, secondArrayItem])
  )
}
