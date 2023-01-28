import {MultilingualText} from "./multilingual-text";

export interface AppGallery {
  slug: string
  title: MultilingualText
  description: MultilingualText
  previewUrl?: string
  creationDate: Date
  lastEditDate?: Date
  createdById: number
  editedById?: number
}

export interface AppImage {
  itemUrl: string
  previewUrl: string,
  title: string
  description: string
  creationDate: Date
  lastEditDate?: Date
  createdById: number
  editedById?: number
}
