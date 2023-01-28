import {MultilingualText} from "../common/multilingual-text";

export interface ProjectDetailsIntroPage {
  title: MultilingualText
  text: MultilingualText
  //TODO: Add Gallery
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
