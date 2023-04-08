import {CatastropheType} from "./catastrophe-type";
import {MultilingualText} from "../common/multilingual-text";
import {ProjectStatus} from "./project-status";

export interface Project {
  slug: string
  title: MultilingualText
  description: MultilingualText
  creationDate: Date
  publishDate?: Date
  catastropheType: CatastropheType
}

export interface ProjectShort {
  title: MultilingualText,
  description: MultilingualText
  slug: string
}

export interface CatastropheTypeAndProjectStatus {
  catastropheType: CatastropheType,
  status: ProjectStatus
}
