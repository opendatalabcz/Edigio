export interface Page <T> {
  size: number
  num: number
  lastPage: number
  items: T[]
}
