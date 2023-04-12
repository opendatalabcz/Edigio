import {Injectable} from "@angular/core";
import {AnonymousUserInfoCreationData} from "../../models/common/user";
import {AnonymousUserInfoCreationDto} from "../../dto/user";
import {ReadOnlyLanguage} from "../../models/common/language";
import {Contact} from "../../models/common/contact";
import {isDefinedNotEmpty} from "../predicates/string-predicates";

@Injectable({
  providedIn: 'root'
})
export class UserConverter {
  normalizedContactForCreation(contact: Contact): Contact {
    return {
      ...contact,
      telephoneNumber: isDefinedNotEmpty(contact.telephoneNumber) ? contact.telephoneNumber : undefined
    }
  }

  anonymousUserCreationDataToDto(data: AnonymousUserInfoCreationData): AnonymousUserInfoCreationDto {
    return {
      contact: this.normalizedContactForCreation(data.contact),
      publishedContactDetail: data.publishedContactDetail,
      spokenLanguagesCodes: data.spokenLanguages?.map((lang: ReadOnlyLanguage) => lang.code)
    }
  }
}
