import {Contact} from "../common/contact";
import {ResponseItem, ResponseItemCreationData} from "./response-item";
import {AdvertisementTitleAndLink, InResponseAdvertisement} from "./advertisement";
import {User} from "../common/user";

export enum AdvertisementResponseStatus {
  WAITING = 'waiting', REJECTED = 'rejected', ACCEPTED = 'accepted'
}

export interface AdvertisementResponseDatesAndState {
  /**
   * Date of advertisement creation
   */
  createdAt?: Date
  /**
   * Date when advertisement was resolved
   */
  resolvedAt?: Date,
  /**
   * Current state of the response
   */
  status?: AdvertisementResponseStatus,
}

export interface AdvertisementResponseSideInfoPreviewCardData extends AdvertisementResponseDatesAndState {
  originalAdvertisementTitleAndLink?: AdvertisementTitleAndLink
}

export interface AdvertisementResponse extends AdvertisementResponseDatesAndState {
  id?: string,
  advertisement: InResponseAdvertisement,
  listedItems: ResponseItem[],
  responderNote?: string
  responder?: User,
}

export interface AdvertisementResponsePreview extends AdvertisementResponseDatesAndState{
  id: string,
  advertisement: InResponseAdvertisement,
  listedItems: ResponseItem[],
  responderNote?: string
  responder: User,
  resolvableByUser: boolean,
  resolvableByToken: boolean
}

export interface AdvertisementResponseCreateData {
  advertisementId: string,
  contact?: Contact
  listedItems: ResponseItemCreationData[]
  note?: string
}
