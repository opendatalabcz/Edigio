import {Contact} from "../common/contact";
import {ListedItem} from "./resource";

export interface AdvertisementResponse {
  advertisementId: string,
  contact: Contact,
  listedItems: ListedItem[]
}
