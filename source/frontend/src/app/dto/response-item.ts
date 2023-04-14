import {ResourceShortDto} from "./resource";

export interface ResponseItemCreateDto {
  resourceSlug: string,
  description?: string
  amount: number
}

export interface ResponseItemDto {
  resource: ResourceShortDto,
  description?: string
  amount: number
}
