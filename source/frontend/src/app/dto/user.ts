import {Contact, PublishedContactDetailSettings} from "../models/common/contact";

export interface AnonymousUserInfoCreationDto {
  contact: Contact
  spokenLanguagesCodes?: string[]
  publishedContactDetail: PublishedContactDetailSettings
}
