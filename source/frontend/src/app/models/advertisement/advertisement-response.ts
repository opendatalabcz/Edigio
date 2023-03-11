import {Contact} from "../common/contact";
import {Advertisement} from "./advertisement";
import {ResponseItem} from "./response-item";

export interface AdvertisementResponse {
  responseId?: string,
  advertisementId: string,
  contact: Contact,
  listedItems: ResponseItem[]
}

export interface AdvertisementResponseCreateDto {
  advertisementId: string,
  contact: Contact
  listedItemsIds: string[]
}
