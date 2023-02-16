import {isInRange} from "./math-predicates";

describe('mat-predicates', () => {
  it('isInRange, value between lower and upper bound yields true ', () => {
    expect(isInRange(9, 7, 12)).toBe(true)
  })

  it('isInRange, same value as lower bound yields true ', () => {
    expect(isInRange(4, 4, 12)).toBe(true)
  })

  it('isInRange, same value as upper bound yields true ', () => {
    expect(isInRange(17, 3, 17)).toBe(true)
  })

  it('isInRange, value, lower bound and upper bound the same yields true ', () => {
    expect(isInRange(501, 501, 501)).toBe(true)
  })

  it('isInRange, value, lower bound and upper bound the same yields true ', () => {
    expect(isInRange(501, 501, 501)).toBe(true)
  })

  it('isInRange, value less than lower bound yields false', () => {
    expect(isInRange(66, 212, 501)).toBe(false)
  })

  it('isInRange, lower bound greater than upper bound, error is thrown', () => {
    expect(() => isInRange(42, 96, 32)).toThrowError(Error)
  })
})
