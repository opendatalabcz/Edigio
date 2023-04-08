import {BASE_API_URL} from "./common-api-config";

export const ADVERTISEMENT_TEMPLATE_API_BASE_URL = `${BASE_API_URL}/advertisement-template`
export const ADVERTISEMENT_TEMPLATE_PAGE_REQUEST_API_URL = `${ADVERTISEMENT_TEMPLATE_API_BASE_URL}/page`

export function singleAdvertisementTemplateApiUrl(slug: string) : string {
  return `${ADVERTISEMENT_TEMPLATE_API_BASE_URL}/${slug}`
}

export function advertisementTemplatePreviewApiUrl(slug: string) : string {
  return `${singleAdvertisementTemplateApiUrl(slug)}/preview`
}

export function advertisementTemplateAllRecommendedResourcesApiUrl(slug: string) : string {
  return `${singleAdvertisementTemplateApiUrl(slug)}/recommended-resources`
}
