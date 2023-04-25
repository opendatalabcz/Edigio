import {BASE_API_URL} from "./common-api-config";
import {isObjectNotNullOrUndefined} from "../shared/predicates/object-predicates";

export const ADVERTISEMENT_BASE_API_URL = BASE_API_URL + "/advertisement"
export const ADVERTISEMENT_CREATION_API_URL = `${ADVERTISEMENT_BASE_API_URL}`
export const ADVERTISEMENT_PAGE_API = `${ADVERTISEMENT_BASE_API_URL}/filtered-page`

export function singleAdvertisementBaseApiUrl(slug: string): string {
  return `${ADVERTISEMENT_BASE_API_URL}/${slug}`
}

export function advertisementDetailApiUrl(slug: string): string {
  return `${singleAdvertisementBaseApiUrl(slug)}/detail`
}

export function advertisementResolveApiUrl(slug: string, token?: string) {
  const postfix = isObjectNotNullOrUndefined(token) ? `/${token}` : ""
  return `${singleAdvertisementBaseApiUrl(slug)}/resolve${postfix}`
}

export function advertisementCancelApiUrl(slug: string, token?: string) {
  const postfix = isObjectNotNullOrUndefined(token) ? `/${token}` : ""
  return `${singleAdvertisementBaseApiUrl(slug)}/cancel${postfix}`
}
