import {MultilingualTextDto} from "./mutlilingual-text";
import {ProjectStatus} from "../models/projects/project-status";
import {CatastropheType} from "../models/projects/catastrophe-type";

export interface ProjectShortDto {
  title: MultilingualTextDto,
  description: MultilingualTextDto
  slug: string
}

export interface ProjectCatastropheTypeAndStatus {
  catastropheType: CatastropheType
  status: ProjectStatus
}
