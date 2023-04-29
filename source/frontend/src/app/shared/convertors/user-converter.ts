import {Injectable} from "@angular/core";
import {NonRegisteredUserInfoCreationData, LoggedUserInfo, User} from "../../models/common/user";
import {NonRegisteredUserInfoCreationDto, LoggedUserInfoDto, PublicUserInfoDto, UserDto} from "../../dto/user";
import {ReadOnlyLanguage} from "../../models/common/language";
import {Contact} from "../../models/common/contact";
import {isDefinedNotEmpty} from "../predicates/string-predicates";
import {LanguageService} from "../../services/language.service";
import {Nullable} from "../types/common";

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

  nonRegisteredUserCreationDataToDto(data: NonRegisteredUserInfoCreationData): NonRegisteredUserInfoCreationDto {
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

  loggedUserInfoDtoToLoggedUserInfo(dto: LoggedUserInfoDto): Nullable<LoggedUserInfo> {
    return {
      username: dto.username
    }
  }

  userDtoToUser(dto: UserDto) : User {
    return {
      id: dto.publicId,
      username: dto.username,
      firstname: dto.firstname,
      lastname: dto.lastname,
      telephoneNumber: dto.telephoneNumber,
      email: dto.email,
      publishedDetails: dto.publishedContactDetailsSettings,
      spokenLanguages: dto.spokenLanguagesCodes
        ? dto.spokenLanguagesCodes.map(code => this.languageService.getReadOnlyLanguageByCode(code)) : undefined
    }
  }
}
