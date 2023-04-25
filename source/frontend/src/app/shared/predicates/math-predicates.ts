export function isInRange(value: number, lowerBound: number, upperBound: number) {
  if(lowerBound > upperBound) {
    throw new Error('Invalid range! Lower bound is greater than upper bound!')
  }
  return lowerBound <= value && value <= upperBound
}
