import {Contact} from "../common/contact";
import {ResponseItem} from "./advertisement";

export interface AdvertisementResponse {
  advertisementId: string,
  contact: Contact,
  listedItems: ResponseItem[]
}
