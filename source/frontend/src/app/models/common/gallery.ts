import {MultilingualText} from "./multilingual-text";

export interface GalleryData {
  slug: string
  title: MultilingualText
  description: MultilingualText
  creationDate: Date
  lastEditDate: Date
  createdById: number
  editedById: number
}

export interface ImageData {
  itemUrl: string
  previewUrl: string,
  title: string
  description: string
  creationDate: Date
  lastEditDate: Date
  createdById: number
  editedById: number
}

export interface VideoData {

}
