import {MultilingualTextDto} from "./mutlilingual-text";

export interface ResourceDto {
  slug: string,
  name: MultilingualTextDto,
  description: MultilingualTextDto,
  galleryId: string
}

export interface ResourceShortDto {
  slug: string,
  name: MultilingualTextDto
}

export interface ListedItemDto {
  slug?: string
  resource: ResourceShortDto,
  amount: number
  /**
   * Differs from resource description,
   * as this field should give additional information related to the listem item itself, instead of resource in general
   */
  description?: MultilingualTextDto
}

export interface ListedItemCreationTo {
  resource: ResourceShortDto,
  amount: number
}
