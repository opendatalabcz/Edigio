import {Injectable} from "@angular/core";
import {MultilingualTextConverter} from "./multilingual-text-converter";
import {AdvertisementCreationData} from "../../models/advertisement/advertisement";
import {AdvertisementCreationDto} from "../../dto/advertisement";
import {isObjectNotNullOrUndefined} from "../predicates/object-predicates";
import {AdvertisementItemConverter} from "./advertisement-item-converter";
import {AdvertisementItem} from "../../models/advertisement/advertisement-item";
import {UserConverter} from "./user-converter";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementConverter {
  constructor(
    private multilingualTextConverter: MultilingualTextConverter,
    private advertisementItemConverter: AdvertisementItemConverter,
    private userConverter: UserConverter
  ) {
  }

  public creationDataToCreationDto(creationData: AdvertisementCreationData): AdvertisementCreationDto {
    const description = isObjectNotNullOrUndefined(creationData.description)
      ? this.multilingualTextConverter.modelToDto(creationData.description) : undefined
    return {
      title: this.multilingualTextConverter.modelToDto(creationData.title),
      description,
      location: creationData.location,
      anonymousUserInfo: this.userConverter.anonymousUserCreationDataToDto(creationData.anonymousUserInfoCreationData),
      projectSlug: creationData.projectSlug,
      type: creationData.type,
      helpType: creationData.helpType,
      items: creationData.items.map(
        (item: AdvertisementItem) => this.advertisementItemConverter.modelToCreationDto(item)
      )
    }
  }
}
