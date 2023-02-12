import {Contact} from "../common/contact";
import {Advertisement, ResponseItem} from "./advertisement";

export interface AdvertisementResponse {
  responseId?: string,
  advertisementId: string,
  contact: Contact,
  listedItems: ResponseItem[]
}
