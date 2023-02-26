import {
  anyMatch,
  cartesianProduct,
  containsAll,
  isArrayEmpty,
  isArrayNullUndefinedOrEmpty
} from "./array-utils";

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

  it('anyMatch with always-true function for empty array returns false', () => {
    const matchFn = (_value: any) => true
    expect(anyMatch([], matchFn)).toBe(false)
  })

  it.each([[[1,2,3,4]],[['',null,undefined]],[[[],[],[]]]])
  ('anyMatch with always-true function for non-empty array returns true', (array: ReadonlyArray<any>) => {
    const matchFn = (_value: any) => true
    expect(anyMatch(array, matchFn)).toBe(true)
  })

  it('empty array anyMatch returns false', () => {
    const matchFn = (_value: any) => true
    expect(anyMatch([], matchFn)).toBe(false)
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

  it('cartesian product of empty arrays is an empty array', () =>{
    expect(cartesianProduct([], [])).toStrictEqual([])
  })

  it.each([[[1,2,3,4,5], []],[[], ['a','b','c']]])(
    'cartesian product of one empty array and one none empty is an empty array',
    (firstArray: unknown[], secondArray: unknown[]) =>{
    expect(cartesianProduct(firstArray, secondArray)).toStrictEqual([])
  })

  it('cartesianProduct returns expected result without changing order', () => {
    const first = [1,2]
    const second = ['a','b']
    const expectedArray = [
      [first[0], second[0]],
      [first[0], second[1]],
      [first[1], second[0]],
      [first[1], second[1]],
    ]
    expect(cartesianProduct(first, second)).toStrictEqual(expectedArray)
  })

  it('cartesianProduct keeps given arrays dimension', () => {
    const first = [[1,2],[[3,4]]]
    const second = [['a'],['b'], [['c']]]
    const expectedArray = [
      [first[0], second[0]],
      [first[0], second[1]],
      [first[0], second[2]],
      [first[1], second[0]],
      [first[1], second[1]],
      [first[1], second[2]],
    ]
    expect(cartesianProduct(first, second)).toStrictEqual(expectedArray)
  })
});
