import {AdvertisementType} from "../models/advertisement/advertisement";

export function oppositeAdvertisementType(advertisementType: AdvertisementType) : AdvertisementType {
  return advertisementType === AdvertisementType.OFFER ? AdvertisementType.REQUEST : AdvertisementType.OFFER
}
