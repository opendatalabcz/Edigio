import {BASE_API_URL} from "./common-api-config";

export const ADVERTISEMENT_BASE_API_URL = BASE_API_URL + "/advertisement"
export const ADVERTISEMENT_CREATION_API_URL = `${ADVERTISEMENT_BASE_API_URL}`
export const ADVERTISEMENT_PAGE_API = `${ADVERTISEMENT_BASE_API_URL}/filtered-page`
export function singleAdvertisementBaseApiUrl(slug: string) : string {
  return  `${ADVERTISEMENT_BASE_API_URL}/${slug}`
}
export function advertisementDetailApiUrl(slug: string) : string {
  return `${singleAdvertisementBaseApiUrl(slug)}/detail`
}
