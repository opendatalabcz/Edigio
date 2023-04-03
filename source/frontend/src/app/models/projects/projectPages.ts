import {MultilingualText} from "../common/multilingual-text";

export interface ProjectDetailsIntroPage {
  title: MultilingualText
  description: MultilingualText
  gallerySlug: string
}

export interface ImportantInformationLink {
  title: MultilingualText,
  location: string,
}

export interface ImportantInformation {
  title: MultilingualText
  text: MultilingualText
  links: ImportantInformationLink[]
}
