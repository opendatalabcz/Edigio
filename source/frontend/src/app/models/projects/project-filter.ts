import {CatastropheType} from "./catastrophe-type";

export interface ProjectFilter {
  /**
   * Left part of title
   */
  title?: string
  publishedAfter?: Date
  publishedBefore?: Date
  slug?: string
  catastropheTypes: CatastropheType[]
}
