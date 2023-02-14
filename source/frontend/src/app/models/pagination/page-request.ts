import {SortDirection} from "../common/sort-direction";

export interface PageRequest {
  num: number,
  size: number
  sortDirection?: SortDirection
}
