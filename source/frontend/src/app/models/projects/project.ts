import {CatastropheType} from "./catastrophe-type";

export interface Project {
  slug: string
  title: string
  description: string
  creationDate: Date
  publishDate?: Date
  catastropheType: CatastropheType
}

export interface ProjectShort {
  title: string
  slug: string
}
