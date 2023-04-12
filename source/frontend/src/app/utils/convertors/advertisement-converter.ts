import {Injectable} from "@angular/core";
import {MultilingualTextConverter} from "./multilingual-text-converter";
import {
  AdvertisementCreationData,
  AdvertisementDetail,
  AdvertisementShort
} from "../../models/advertisement/advertisement";
import {AdvertisementCreationDto, AdvertisementDetailDto, AdvertisementShortDto} from "../../dto/advertisement";
import {isObjectNotNullOrUndefined} from "../predicates/object-predicates";
import {AdvertisementItemConverter} from "./advertisement-item-converter";
import {AdvertisementItem} from "../../models/advertisement/advertisement-item";
import {UserConverter} from "./user-converter";
import {ApiDateTimeConverter} from "./api-date-time-converter";
import {Address} from "../../models/common/address";
import {isDefinedNotEmpty} from "../predicates/string-predicates";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementConverter {
  constructor(
    private multilingualTextConverter: MultilingualTextConverter,
    private advertisementItemConverter: AdvertisementItemConverter,
    private userConverter: UserConverter,
    private apiDateTimeConverter: ApiDateTimeConverter
  ) {
  }

  private normalizeAddressForCreation(address: Address): Address {
    return {
      country: isDefinedNotEmpty(address.country) ? address.country : undefined,
      region: isDefinedNotEmpty(address.region) ? address.region : undefined,
      city: isDefinedNotEmpty(address.city) ? address.city : undefined,
      street: isDefinedNotEmpty(address.street) ? address.street : undefined,
      houseNumber: isDefinedNotEmpty(address.houseNumber) ? address.houseNumber : undefined,
      postalCode: isDefinedNotEmpty(address.postalCode) ? address.postalCode : undefined
    }
  }

  public creationDataToCreationDto(creationData: AdvertisementCreationData): AdvertisementCreationDto {
    const description =
      isObjectNotNullOrUndefined(creationData.description) && creationData.description.hasAnyNotEmptyText()
        ?  this.multilingualTextConverter.modelToDto(creationData.description) : undefined

    return {
      title: this.multilingualTextConverter.modelToDto(creationData.title),
      description,
      location: this.normalizeAddressForCreation(creationData.location),
      anonymousUserInfo: this.userConverter.anonymousUserCreationDataToDto(creationData.anonymousUserInfoCreationData),
      projectSlug: creationData.projectSlug,
      type: creationData.type,
      helpType: creationData.helpType,
      items: creationData.items.map(
        (item: AdvertisementItem) => this.advertisementItemConverter.modelToCreationDto(item)
      ),
    }
  }

  public shortDtoToShortModel(dto: AdvertisementShortDto): AdvertisementShort {
    return {
      id: dto.slug,
      title: this.multilingualTextConverter.dtoToModel(dto.title),
      description: this.multilingualTextConverter.dtoToModel(dto.description),
      type: dto.type
    }
  }

  detailDtoToDetailModel(dto: AdvertisementDetailDto): AdvertisementDetail {
    const lastApprovedAt = isObjectNotNullOrUndefined(dto.lastApprovedAt)
      ? this.apiDateTimeConverter.stringToDate(dto.lastApprovedAt) : undefined
    const lastEditedAt = isObjectNotNullOrUndefined(dto.lastEditedAt)
      ? this.apiDateTimeConverter.stringToDate(dto.lastEditedAt) : undefined
    return {
      id: dto.slug,
      title: this.multilingualTextConverter.dtoToModel(dto.title),
      description: this.multilingualTextConverter.dtoToModel(dto.description),
      type: dto.type,
      helpType: dto.helpType,
      status: dto.status,
      authorId: dto.author,
      createdAt: this.apiDateTimeConverter.stringToDate(dto.createdAt),
      lastApprovedById: dto.lastApprovedBy,
      lastApprovedAt: lastApprovedAt,
      lastEditedAt: lastEditedAt,
      listedItems: dto.listedItems.map(
        (item) => this.advertisementItemConverter.dtoToModel(item)
      )
    };
  }
}
