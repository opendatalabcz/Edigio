import {MultilingualTextDto} from "./mutlilingual-text";

export interface ProjectDetailsIntroPageDto {
  title: MultilingualTextDto
  description: MultilingualTextDto
  gallerySlug: string
}

export interface ImportantInformationLinkDto {
  title: MultilingualTextDto,
  location: string,
}

export interface ImportantInformationDto {
  title: MultilingualTextDto
  text: MultilingualTextDto
  links: ImportantInformationLinkDto[]
}
