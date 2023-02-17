import {containsAll, isArrayEmpty, isArrayNullUndefinedOrEmpty} from "./array-utils";

describe('array-utils', () => {

  it('empty array isArrayEmpty returns true', () => {
    expect(isArrayEmpty([])).toBe(true)
  });

  it('array of empty arrays isArrayEmpty returns false', () => {
    expect(isArrayEmpty([[],[],[]])).toBe(false)
  });

  it('not empty array isArrayEmpty returns false', () => {
    expect(isArrayEmpty([1,2,3,4,5])).toBe(false)
  });

  it('empty array is isArrayNullUndefinedOrEmpty returns true', () => {
    expect(isArrayNullUndefinedOrEmpty([])).toBe(true);
  });

  it('array of empty arrays isArrayNullUndefinedOrEmpty returns false', () => {
    expect(isArrayNullUndefinedOrEmpty([[],[],[]])).toBe(false)
  });

  it('not empty array isArrayNullUndefinedOrEmpty returns false', () => {
    expect(isArrayNullUndefinedOrEmpty([1,2,3,4,5])).toBe(false)
  });

  it('null isArrayNullUndefinedOrEmpty returns true', () => {
    expect(isArrayNullUndefinedOrEmpty(null)).toBe(true)
  })

  it('undefined isArrayNullUndefinedOrEmpty returns true', () => {
    expect(isArrayNullUndefinedOrEmpty(undefined)).toBe(true)
  })

  it('empty array containsAll items from empty array', () => {
    expect(containsAll([], [])).toBe(true)
  })

  it('not empty array containsAll items from empty array', () => {
    expect(containsAll([1,2,3,4], [])).toBe(true)
  })

  it('subject array subset of items array containsAll returns false', () => {
    expect(containsAll([1,2,3], [1,2,3,4])).toBe(false)
  })

  it('items array subset of subject array containsAll returns true', () => {
    expect(containsAll([1,2,3,4], [1,2,3])).toBe(true)
  })

  it('subject array same as items array containsAll returns true', () => {
    expect(containsAll([1,2,3], [1,2,3])).toBe(true)
  })

  it('arrays of same length, one item different, containsAll returns false', () => {
    expect(containsAll([1,2,3], [1,4,3])).toBe(false)
  })
});
