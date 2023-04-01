import {Contact} from "../common/contact";
import {ResponseItem, ResponseItemCreationDto} from "./response-item";
import {Advertisement, AdvertisementShort, AdvertisementTitleAndLink, InResponseAdvertisement} from "./advertisement";
import {User} from "../common/user";

export enum AdvertisementResponseStatus {
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
  status?: AdvertisementResponseStatus,
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
  listedItems: ResponseItemCreationDto[]
  note?: string
}
