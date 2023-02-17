import {CatastropheType} from "./catastrophe-type";
import {PublishedDateFilter} from "../common/common-filters";
import {LocalizedText} from "../common/multilingual-text";

export interface ProjectFilter extends PublishedDateFilter {
  title?: LocalizedText,
  catastropheTypes: CatastropheType[]
}
