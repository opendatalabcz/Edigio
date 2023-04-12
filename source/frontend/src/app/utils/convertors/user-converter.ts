import {Injectable} from "@angular/core";
import {AnonymousUserInfoCreationData, User} from "../../models/common/user";
import {AnonymousUserInfoCreationDto, PublicUserInfoDto} from "../../dto/user";
import {ReadOnlyLanguage} from "../../models/common/language";
import {Contact} from "../../models/common/contact";
import {isDefinedNotEmpty} from "../predicates/string-predicates";
import {LanguageService} from "../../services/language.service";

@Injectable({
  providedIn: 'root'
})
export class UserConverter {
  constructor(private languageService: LanguageService) {
  }


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

  publicUserInfoDtoToUserModel(dto: PublicUserInfoDto): User {
    return {
      username: dto.username,
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      telephoneNumber: dto.telephoneNumber,
      spokenLanguages: dto.spokenLanguagesCodes?.map(
        code => this.languageService.getReadOnlyLanguageByCode(code)
      )
    }
  }
}
