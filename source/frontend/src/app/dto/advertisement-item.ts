import {ResourceShortDto} from "./resource";
import {MultilingualTextDto} from "./mutlilingual-text";

export interface AdvertisementItemDto {
  id?: string
  /**
   * Base resource for advertised item
   */
  resource: ResourceShortDto,
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
  description?: MultilingualTextDto
}

export interface AdvertisementItemCreationDto {
  resourceSlug: string,
  description?: MultilingualTextDto
  amount: number,
}
