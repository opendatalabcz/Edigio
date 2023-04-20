import {CatastropheType} from "./catastrophe-type";
import {MultilingualText} from "../common/multilingual-text";
import {ProjectStatus} from "./project-status";

export interface ProjectShort {
  title: MultilingualText,
  description: MultilingualText
  status: ProjectStatus,
  slug: string
}

export interface CatastropheTypeAndProjectStatus {
  catastropheType: CatastropheType,
  status: ProjectStatus
}
