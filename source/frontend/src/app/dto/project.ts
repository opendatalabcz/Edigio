import {MultilingualTextDto} from "./mutlilingual-text";
import {ProjectStatus} from "../models/projects/project-status";

export interface ProjectShortDto {
  title: MultilingualTextDto,
  description: MultilingualTextDto,
  status: ProjectStatus
  slug: string
}
