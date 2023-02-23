import {Page, PageInfo} from "../models/pagination/page";
import {PageRequest} from "../models/pagination/page-request";
import {SortDirection} from "../models/common/sort-direction";

/**
 * Map page items, and return new page with mapped collection
 *
 * @param page Page to be mapped
 * @param mapFn Map function to be used
 */
export function mapPageItems<T, U>(page: Page<T>, mapFn: (item: T) => U) : Page<U> {
  const items = page.items.map(mapFn)
  return {idx: page.idx, size: page.size, items, totalItemsAvailable: page.totalItemsAvailable, sortDirection: page.sortDirection}
}

/**
 * Get either next page info or next page request
 *
 * @param current
 */
export function nextPageInfo<T extends PageInfo | PageRequest>(current: T) : T {
  return {...current, idx: current.idx + 1}
}

/**
 * Create page from given items array
 *
 * <p>Slices given items array, so it corresponds to requested page</p>
 *
 * @param items Collection of all items, from which page should be sliced
 * @param pageRequest Requested page info
 */
export function pageFromItems<T>(items: T[], pageRequest: PageRequest): Page<T> {
  return {
    idx: pageRequest.idx,
    size: pageRequest.size,
    items: items.slice(getPageFirstIndex(pageRequest), getPageLastIndex(pageRequest) + 1),
    totalItemsAvailable: items.length,
    sortDirection: pageRequest.sortDirection
  }
}

/**
 * Create request to retrieve first page
 *
 * @param size
 * @param sortDirection
 */
export function firstPageRequest(size: number, sortDirection: SortDirection) : PageRequest {
  return { idx: 0, size, sortDirection }
}


/**
 * Get absolute index of first item on page
 *
 * <p>Can be used to retrieve item from collection sliced by page</>
 *
 * @param pageInfo PageInfo of Page to which information relates
 */
export function getPageFirstIndex(pageInfo: PageInfo | PageRequest) {
  const index = pageInfo.idx * pageInfo.size;
  const indexOutOfBounds = 'totalItemsAvailable' in pageInfo && index >= pageInfo.totalItemsAvailable
  return indexOutOfBounds ? pageInfo.totalItemsAvailable : index
}

/**
 * Get absolute index of last item on page
 *
 * <p> Absolute index can be used to retrieve item from collection sliced by page </p>
 *
 * @param pageInfo PageInfo of Page to which information relates
 */
export function getPageLastIndex(pageInfo: PageInfo |  PageRequest) {
  //Required for empty pages
  const zeroClampedLastIndex = Math.max(getPageFirstIndex(nextPageInfo(pageInfo)) - 1, 0)
  if('totalItemsAvailable' in pageInfo && zeroClampedLastIndex >= pageInfo.totalItemsAvailable)  {
    return Math.max(pageInfo.totalItemsAvailable - 1, 0)
  } else {
    return zeroClampedLastIndex
  }
}

/**
 * Returns total number of pages available
 *
 * @param pageInfo Current page info
 */
export function getTotalPagesNumber(pageInfo: PageInfo) : number {
  return Math.ceil(pageInfo.totalItemsAvailable / pageInfo.size)
}
