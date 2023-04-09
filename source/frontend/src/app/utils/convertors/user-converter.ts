import {Injectable} from "@angular/core";
import {AnonymousUserInfoCreationData} from "../../models/common/user";
import {AnonymousUserInfoCreationDto} from "../../dto/user";
import {ReadOnlyLanguage} from "../../models/common/language";

@Injectable({
  providedIn: 'root'
})
export class UserConverter {
  anonymousUserCreationDataToDto(data: AnonymousUserInfoCreationData): AnonymousUserInfoCreationDto {
    return {
      contact: data.contact,
      publishedContactDetail: data.publishedContactDetail,
      spokenLanguagesCodes: data.spokenLanguages?.map((lang: ReadOnlyLanguage) => lang.code)
    }
  }
}
