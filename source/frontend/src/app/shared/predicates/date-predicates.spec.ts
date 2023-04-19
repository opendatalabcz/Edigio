import {firstDateEarlierOrTheSameAsSecondDate} from "./date-predicates";

describe('date-predicates', () =>{
  it('firstDateEarlierOrTheSameAsSecondDate, both date the same, returns true', () => {
    expect(
      firstDateEarlierOrTheSameAsSecondDate(new Date(2018,11,21), new Date(2018,11,21))
    ).toBe(true)
  })

  it('firstDateEarlierOrTheSameAsSecondDate, first date earlier than second date, returns true', () => {
    expect(
      firstDateEarlierOrTheSameAsSecondDate(new Date(2018,11,21), new Date(2018,11,22))
    ).toBe(true)
  })

  it('firstDateEarlierOrTheSameAsSecondDate, first date earlier than second date, returns true', () => {
    expect(
      firstDateEarlierOrTheSameAsSecondDate(new Date(2018,11,22), new Date(2018,11,21))
    ).toBe(false)
  })

  it('firstDateEarlierOrTheSameAsSecondDate, first date earlier than second date, returns true', () => {
    expect(
      firstDateEarlierOrTheSameAsSecondDate(new Date(2018,11,22), new Date(2018,11,21))
    ).toBe(false)
  })
})
