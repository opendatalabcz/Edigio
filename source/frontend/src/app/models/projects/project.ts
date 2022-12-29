export interface Project {
  slug: string
  title: string
  description: string
  creationDate: Date
  publishDate?: Date
}

export interface ProjectShort {
  title: string
  slug: string
}
