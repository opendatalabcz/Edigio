import {Page} from "../models/pagination/page";
import {PageRequest} from "../models/pagination/page-request";
import {SortDirection} from "../models/common/sort-direction";

export function mapPageItems<T, U>(page: Page<T>, mapFn: (item: T) => U) : Page<U> {
  const items = page.items.map(mapFn)
  return {num: page.num, size: page.size, items, lastPage: page.lastPage, sortDirection: page.sortDirection}
}

export function nextPageRequest(current: Page<unknown> | PageRequest) : PageRequest {
  return { num: current.num + 1, size: current.size, sortDirection: current.sortDirection }
}

export function pageFromItems<T>(items: T[], pageRequest: PageRequest): Page<T> {
  const pageIdx = (pageRequest.num - 1)
  return {
    num: pageRequest.num,
    size: pageRequest.size,
    items: items.slice(pageIdx * pageRequest.size, pageRequest.num * pageRequest.size),
    lastPage: Math.floor(items.length / pageRequest.size),
    sortDirection: pageRequest.sortDirection
  }
}

export function firstPageRequest(size: number, sortDirection: SortDirection) {
  return { num: 0, size, sortDirection }
}
