import {Address} from "../models/common/address";
import {AdvertisementHelpType} from "../models/advertisement/advertisement-help-type";
import {AdvertisementStatus, AdvertisementType} from "../models/advertisement/advertisement";
import {MultilingualTextDto} from "./mutlilingual-text";
import {AnonymousUserInfoCreationDto} from "./user";
import {AdvertisementItemCreationDto, AdvertisementItemDto} from "./advertisement-item";
import {MultilingualText} from "../models/common/multilingual-text";

export interface AdvertisementCreationDto {
  title: MultilingualTextDto,
  description?: MultilingualTextDto,
  location: Address
  anonymousUserInfo: AnonymousUserInfoCreationDto,
  projectSlug: string
  type: AdvertisementType,
  helpType: AdvertisementHelpType,
  items: AdvertisementItemCreationDto[],
}

export interface AdvertisementShortDto {
  /**
   * Identifier of the Advertisement
   */
  slug: string
  /**
   * Localized title of the Advertisement
   */
  title: MultilingualTextDto
  /**
   * Localized description of the Advertisement
   */
  description: MultilingualTextDto
  /**
   * Type of the Advertisement
   */
  type: AdvertisementType
}

export interface AdvertisementDetailDto {
  title: MultilingualText
  description: MultilingualText
  type: AdvertisementType
  helpType: AdvertisementHelpType,
  status: AdvertisementStatus
  listedItems: AdvertisementItemDto[]
  createdAt: Date
  author: string
  lastApprovedAt?: Date
  lastApprovedBy?: string
  lastEditedAt?: Date
  lastEditedBy?: string
  slug: string
}
