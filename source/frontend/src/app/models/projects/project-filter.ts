import {CatastropheType} from "./catastrophe-type";
import {PublishedDateFilter} from "../common/common-filters";

export interface ProjectFilter extends PublishedDateFilter {
  title?: string,
  catastropheTypes: CatastropheType[]
}
