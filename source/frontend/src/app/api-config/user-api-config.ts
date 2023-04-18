import {BASE_API_URL} from "./common-api-config";

export const USER_BASE_API_URL = `${BASE_API_URL}/user`
export const USER_REGISTRATION_API_URL = `${USER_BASE_API_URL}/register`
export const LOGGED_USER_BASE_API_URL = `${BASE_API_URL}/user/me`
export const LOGGED_USER_INFO_API_URL = `${LOGGED_USER_BASE_API_URL}/info`
export const LOGGED_USER_DETAIL_API_URL = `${LOGGED_USER_BASE_API_URL}/detail`
export const LOGGED_USER_PUBLISHED_CONTACT_DETAIL_SETTINGS_CHANGE_API_URL
  = `${LOGGED_USER_BASE_API_URL}/published-contact-detail-settings`
export const LOGGED_USER_SPOKEN_LANGUAGES_CHANGE_API_URL
  = `${LOGGED_USER_BASE_API_URL}/spoken-languages`

export const LOGGED_USER_EMAIL_CHANGE_REQUEST_API_URL = `${LOGGED_USER_BASE_API_URL}/email/request`
export function loggedUserEmailChangeRequestConfirmationApiUrl(currentEmailToken: string, newEmailToken: string) {
  return `${LOGGED_USER_BASE_API_URL}/email/confirm/${currentEmailToken}/${newEmailToken}`
}

export function singleUserBaseApiUrl(publicId: string) {
  return `${USER_BASE_API_URL}/${publicId}`
}

export function publicUserInfoApiUrl(publicId: string) {
  return `${singleUserBaseApiUrl(publicId)}`
}

export function userContactConfirmationApiUrl(publicId: string, token: string) {
  return `${singleUserBaseApiUrl(publicId)}/confirm-email/${token}`
}
