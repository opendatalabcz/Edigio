import {ResponseItemCreateDto} from "./response-item";
import {AnonymousUserInfoCreationDto} from "./user";
import {Contact} from "../models/common/contact";

export interface AdvertisementResponseCreationDto {
  advertisementSlug: string,
  contact?: Contact
  listedItems: ResponseItemCreateDto[]
  note?: string
}
