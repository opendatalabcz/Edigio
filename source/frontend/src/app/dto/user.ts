import {Contact, PublishedContactDetailSettings} from "../models/common/contact";

export interface AnonymousUserInfoCreationDto {
  contact: Contact
  spokenLanguagesCodes?: string[]
  publishedContactDetail: PublishedContactDetailSettings
}

export interface PublicUserInfoDto {
  username?: string
  firstname?: string,
  lastname?: string,
  email?: string,
  telephoneNumber?: string,
  spokenLanguagesCodes?: string[],
}
