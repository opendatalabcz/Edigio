import {BASE_API_URL} from "./common-api-config";
import {isDefinedNotEmpty} from "../utils/predicates/string-predicates";

export const ADVERTISEMENT_RESPONSE_API_BASE_URL = `${BASE_API_URL}/advertisement-response`
export const ADVERTISEMENT_RESPONSE_CREATION_API_URL = `${ADVERTISEMENT_RESPONSE_API_BASE_URL}`

export function singleAdvertisementResponseApiUrl(slug: string) : string {
  return `${ADVERTISEMENT_RESPONSE_API_BASE_URL}/${slug}`
}

function createOptionalTokenUrlPostfix(token?: string) {
  return isDefinedNotEmpty(token) ? `/${token}` : ""
}

export function advertisementResponsePreviewApiUrl(publicId: string, token?: string) {
  return `${singleAdvertisementResponseApiUrl(publicId)}/preview${createOptionalTokenUrlPostfix(token)}`
}

export function advertisementResponseAcceptApiUrl(publicId: string) {
  return `${singleAdvertisementResponseApiUrl(publicId)}/accept`
}

export function advertisementResponseRejectApiUrl(publicId: string) {
  return `${singleAdvertisementResponseApiUrl(publicId)}/reject`
}
