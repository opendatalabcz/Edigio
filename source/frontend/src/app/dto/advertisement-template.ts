import {MultilingualTextDto} from "./mutlilingual-text";

export interface AdvertisementTemplateShortDto {
  name: MultilingualTextDto
  slug: string
}

export interface AdvertisementTemplatePreviewDto {
  name: MultilingualTextDto
  description: MultilingualTextDto
  slug: string
}
