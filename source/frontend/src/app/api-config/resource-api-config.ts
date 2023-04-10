import {BASE_API_URL} from "./common-api-config";

export const RESOURCE_BASE_API_URL = `${BASE_API_URL}/resource`
export const RESOURCES_PAGE_API_URL =  `${RESOURCE_BASE_API_URL}/all`
export function singleResourceBaseApiUrl(slug: string) {
  return `${RESOURCE_BASE_API_URL}/${slug}`
}

export function resourceApiUrl(slug: string) {
  return `${singleResourceBaseApiUrl(slug)}`
}
