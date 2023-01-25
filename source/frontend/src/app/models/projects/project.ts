import {CatastropheType} from "./catastrophe-type";
import {MultilingualText} from "../common/multilingual-text";

export interface Project {
  slug: string
  title: MultilingualText
  description: MultilingualText
  creationDate: Date
  publishDate?: Date
  catastropheType: CatastropheType
}

export interface ProjectShort {
  title: MultilingualText
  slug: string
}

export interface ProjectDetailsPage {
  title: MultilingualText
  text: MultilingualText
  //TODO: Add Gallery
}
