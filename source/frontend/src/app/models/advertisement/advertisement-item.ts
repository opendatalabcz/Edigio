import {ResourceBasedListedItem, ResourceShort} from "./resource";
import {MultilingualText} from "../common/multilingual-text";

export interface AdvertisementItem extends ResourceBasedListedItem {
  id?: string
  /**
   * Base resource for advertised item
   */
  resource: ResourceShort,
  /**
   * Advertised amount
   *
   * Should be greater or equal to zero
   */
  amount: number
  /**
   * Differs from resource description,
   * as this field should give additional information related to the listem item itself, instead of resource in general
   */
  description?: MultilingualText
}

export interface AdvertisementItemCreationData {
  resourceId: string,
  description: MultilingualText
  amount: number,
}
