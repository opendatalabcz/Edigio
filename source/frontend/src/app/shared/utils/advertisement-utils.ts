import {AdvertisementType} from "../../models/advertisement/advertisement";
import {requireValidAdvertisementType} from "../assertions/advertisement-assertions";

/**
 * Retrieves advertisement type that's opposite to given advertisement type
 *
 * @param advertisementType Advertisement type to which opposite should be returned
 */
export function oppositeAdvertisementType(advertisementType: AdvertisementType) : AdvertisementType {
  requireValidAdvertisementType(advertisementType, 'Cannot create opposite of unknown advertisement type!')
  return advertisementType === AdvertisementType.OFFER ? AdvertisementType.REQUEST : AdvertisementType.OFFER
}
