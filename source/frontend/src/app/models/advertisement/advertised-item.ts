import {ResourceBasedListedItem, ResourceShort} from "./resource";
import {MultilingualText, MultilingualTextData} from "../common/multilingual-text";
import {Contact} from "../common/contact";

export interface AdvertisedItem extends ResourceBasedListedItem {
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

export interface AdvertisedItemCreateDto {
  resourceId: string,
  description: MultilingualTextData
  amount: number,
}

export interface AdvertisementCreateDto {
  contact: Contact
  title: MultilingualText
  description: MultilingualText
  listedItems: AdvertisedItemCreateDto[]
}
