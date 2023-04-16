import {Address} from "../models/common/address";
import {AdvertisementHelpType} from "../models/advertisement/advertisement-help-type";
import {AdvertisementStatus, AdvertisementType} from "../models/advertisement/advertisement";
import {MultilingualTextDto} from "./mutlilingual-text";
import {AnonymousUserInfoCreationDto} from "./user";
import {AdvertisementItemCreationDto, AdvertisementItemDto} from "./advertisement-item";

export interface AdvertisementCreationDto {
  title: MultilingualTextDto,
  description?: MultilingualTextDto,
  location: Address
  anonymousUserInfo?: AnonymousUserInfoCreationDto,
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
  description?: MultilingualTextDto
  /**
   * Type of the Advertisement
   */
  type: AdvertisementType
}

export interface AdvertisementDetailDto {
  title: MultilingualTextDto
  description: MultilingualTextDto
  type: AdvertisementType
  helpType: AdvertisementHelpType,
  status: AdvertisementStatus
  listedItems: AdvertisementItemDto[]
  createdAt: string
  author: string
  lastApprovedAt?: string
  lastApprovedBy?: string
  lastEditedAt?: string
  lastEditedBy?: string
  slug: string
}

export interface InResponseAdvertisementDto {
  slug: string,
  title: MultilingualTextDto,
  type: AdvertisementType,
}
