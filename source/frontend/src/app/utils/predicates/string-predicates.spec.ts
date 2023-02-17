import {Nullable} from "../types/common";
import {isDefinedNotBlank, isDefinedNotEmpty} from "./string-predicates";

describe('string-predicates', () => {
  it('isDefinedNotEmpty - empty string - returns false', () => {
    expect(isDefinedNotEmpty('')).toBe(false)
  })

  it('isDefinedNotEmpty - undefined - returns false', () => {
    expect(isDefinedNotEmpty(undefined)).toBe(false)
  })

  it('isDefinedNotEmpty - null - returns false', () => {
    expect(isDefinedNotEmpty(null)).toBe(false)
  })

  it('isDefinedNotEmpty - blank string - returns true', () => {
    expect(isDefinedNotEmpty(' ')).toBe(true)
  })

  it('isDefinedNotEmpty - lorem ipsum - returns true', () => {
    expect(isDefinedNotEmpty('lorem ipsum')).toBe(true)
  })

  it('isDefinedNotBlank - empty string - returns false', () => {
    expect(isDefinedNotBlank('')).toBe(false)
  })

  it('isDefinedNotBlank - undefined - returns false', () => {
    expect(isDefinedNotBlank(undefined)).toBe(false)
  })

  it('isDefinedNotBlank - null - returns false', () => {
    expect(isDefinedNotBlank(null)).toBe(false)
  })

  it('isDefinedNotBlank - blank string - returns false', () => {
    expect(isDefinedNotBlank(' ')).toBe(false)
  })

  it('isDefinedNotBlank - lorem ipsum - returns true', () => {
    expect(isDefinedNotBlank('lorem ipsum')).toBe(true)
  })
})
