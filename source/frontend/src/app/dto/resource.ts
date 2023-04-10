import {MultilingualTextDto} from "./mutlilingual-text";

export interface ResourceDto {
  slug: string,
  name: MultilingualTextDto,
  description: MultilingualTextDto,
}

export interface ResourceShortDto {
  slug: string,
  name: MultilingualTextDto
}
