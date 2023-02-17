import {SortDirection} from "../common/sort-direction";

export interface PageRequest {
  idx: number,
  size: number
  sortDirection?: SortDirection
}
