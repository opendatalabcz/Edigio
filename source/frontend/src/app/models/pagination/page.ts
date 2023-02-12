import {SortDirection} from "../common/sort-direction";
import {Observable} from "rxjs";

export interface PageInfo {
  size: number,
  num: number,
  lastPage: number,
  sortDirection: SortDirection
}

export interface Page <T> extends PageInfo{
  items: T[]
}
