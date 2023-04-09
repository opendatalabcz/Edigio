import {Address} from "../models/common/address";
import {AdvertisementHelpType} from "../models/advertisement/advertisement-help-type";
import {AdvertisementType} from "../models/advertisement/advertisement";
import {MultilingualTextDto} from "./mutlilingual-text";
import {AnonymousUserInfoCreationDto} from "./user";
import {AdvertisementItemCreationDto} from "./advertisement-item";

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
