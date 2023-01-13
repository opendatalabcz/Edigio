import {SortDirection} from "./sort-direction";

export interface Page <T> {
  size: number
  num: number
  lastPage: number
  sortDirection: SortDirection
  items: T[]
}
