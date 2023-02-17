import {Page, PageInfo} from "../models/pagination/page";
import {PageRequest} from "../models/pagination/page-request";
import {SortDirection} from "../models/common/sort-direction";

export function mapPageItems<T, U>(page: Page<T>, mapFn: (item: T) => U) : Page<U> {
  const items = page.items.map(mapFn)
  return {idx: page.idx, size: page.size, items, totalItemsAvailable: page.totalItemsAvailable, sortDirection: page.sortDirection}
}

export function nextPageRequest(current: Page<unknown> | PageRequest) : PageRequest {
  return { idx: current.idx + 1, size: current.size, sortDirection: current.sortDirection }
}

export function nextPageInfo<T extends PageInfo | PageRequest>(current: T) : T {
  return {...current, idx: current.idx + 1}
}

export function pageFromItems<T>(items: T[], pageRequest: PageRequest): Page<T> {
  return {
    idx: pageRequest.idx,
    size: pageRequest.size,
    items: items.slice(getPageFirstIndex(pageRequest), getPageLastIndex(pageRequest) + 1),
    totalItemsAvailable: items.length,
    sortDirection: pageRequest.sortDirection
  }
}

export function firstPageRequest(size: number, sortDirection: SortDirection) : PageRequest {
  return { idx: 0, size, sortDirection }
}


export function getPageFirstIndex(pageInfo: PageInfo | PageRequest) {
  const index = pageInfo.idx * pageInfo.size;
  const indexOutOfBounds = 'totalItemsAvailable' in pageInfo && index >= pageInfo.totalItemsAvailable
  return indexOutOfBounds ? pageInfo.totalItemsAvailable : index
}

export function getPageLastIndex(pageInfo: PageInfo |  PageRequest) {
  //Required for empty pages
  const zeroClampedLastIndex = Math.max(getPageFirstIndex(nextPageInfo(pageInfo)) - 1, 0)
  if('totalItemsAvailable' in pageInfo && zeroClampedLastIndex >= pageInfo.totalItemsAvailable)  {
    return Math.max(pageInfo.totalItemsAvailable - 1, 0)
  } else {
    return zeroClampedLastIndex
  }
}
