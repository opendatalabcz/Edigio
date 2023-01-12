import {Page} from "../models/common/page";
import {PageRequest} from "../models/common/page-request";

export function mapPageItems<T, U>(page: Page<T>, mapFn: (item: T) => U) : Page<U> {
  const items = page.items.map(mapFn)
  return {num: page.num, size: page.size, items, lastPage: page.lastPage}
}

export function nextPageRequest(current: Page<unknown> | PageRequest) : PageRequest {
  return { num: current.num, size: current.size }
}
