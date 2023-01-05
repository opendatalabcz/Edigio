export function isNullOrUndefined(item?: any) {
  return item == undefined || item == null
}

export function isNotNullAndNotUndefined(item?: any) {
  return isNullOrUndefined(item)
}
