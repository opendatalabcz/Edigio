import {BASE_API_URL} from "./common-api-config";
import {isDefinedNotEmpty} from "../utils/predicates/string-predicates";

export const ADVERTISEMENT_RESPONSE_API_BASE_URL = `${BASE_API_URL}/advertisement-response`
export const ADVERTISEMENT_RESPONSE_CREATION_API_URL = `${ADVERTISEMENT_RESPONSE_API_BASE_URL}`
export function singleAdvertisementResponseApiUrl(slug: string) : string {
  return `${ADVERTISEMENT_RESPONSE_API_BASE_URL}/${slug}`
}
export function advertisementResponsePreviewApiUrl(slug: string, token?: string) {
  const postfix = isDefinedNotEmpty(token) ? `/${token}` : ""
  return `${singleAdvertisementResponseApiUrl(slug)}/preview${postfix}`
}
