import {Contact} from "../common/contact";
import {ResponseItem} from "./response-item";
import {Advertisement, AdvertisementShort, AdvertisementTitleAndLink, InResponseAdvertisement} from "./advertisement";
import {User} from "../common/user";

export enum AdvertisementResponseState {
  WAITING='waiting', REJECTED='rejected', ACCEPTED='accepted'
}

export interface AdvertisementResponseDatesAndState {
  /**
   * Date of advertisement creation
   */
  creationDate?: Date
  /**
   * Date when advertisement was resolved
   */
  resolveDate?: Date,
  /**
   * Current state of the response
   */
  state?: AdvertisementResponseState,
}

export interface AdvertisementResponseSideInfoPreviewCardData extends  AdvertisementResponseDatesAndState{
  originalAdvertisementTitleAndLink?: AdvertisementTitleAndLink
}

export interface AdvertisementResponse extends AdvertisementResponseDatesAndState {
  responseId?: string,
  advertisement: InResponseAdvertisement,
  listedItems: ResponseItem[],
  note?: string
  responder?: User,
}

export interface AdvertisementResponseCreateData {
  advertisementId: string,
  contact?: Contact
  listedItemsResourcesIds: string[]
  note?: string
}
