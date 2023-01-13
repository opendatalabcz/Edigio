import {SortDirection} from "./sort-direction";

export interface PageRequest {
  num: number,
  size: number
  sortDirection: SortDirection
}
