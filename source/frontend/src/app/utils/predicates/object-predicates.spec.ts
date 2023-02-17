import {isObjectNull, isObjectNullOrUndefined} from "./object-predicates";

describe('object-predicates', () => {
  it('isObjectNull - null - returns true', () => {
    expect(isObjectNull(null)).toBe(true)
  })

  it.each(['',0, -0, 0n, NaN, false, undefined])
  ('isObjectNull - falsy values - %p - returns true', (obj) => {
    expect(isObjectNull(obj)).toBe(false)
  })

  it.each([null, undefined])('isObjectNullOrUndefined - %p - returns true', (obj) => {
    expect(isObjectNullOrUndefined(obj)).toBe(true)
  })

  it.each(['',0, -0, 0n, NaN, false])
  ('isObjectNullOrUndefined - falsy values - %p - returns false', (obj) => {
    expect(isObjectNullOrUndefined(obj)).toBe(false)
  })
})
