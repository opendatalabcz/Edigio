export const BASE_API_URL = "http://localhost:8080"
export const ADVERTISEMENTS_API_URL = BASE_API_URL + "/advertisement"
export const PROJECTS_API_URL = BASE_API_URL + "/project"

export function projectShortApiUrl(slug: string): string {
  return PROJECTS_API_URL + `/${encodeURIComponent(slug)}/short`
}

export const PROJECTS_PAGE_REQUEST_API_URL = PROJECTS_API_URL + "/filtered-page"

export function projectDetailsPageRetrievalApiURl(slug: string) {
  return PROJECTS_API_URL + `/${encodeURIComponent(slug)}/details-page`
}

export function projectExistsApiUrl(slug: string) {
  return PROJECTS_API_URL + `/${encodeURIComponent(slug)}/exists`
}
