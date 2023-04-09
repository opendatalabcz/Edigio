import {ResourceBasedListedItem, ResourceShort} from "./resource";

export interface ResponseItem extends ResourceBasedListedItem {
  id?: string
  resource: ResourceShort,
  amount: number
  /**
   * Differs from resource description,
   * as this field should give additional information related to the listem item itself, instead of resource in general
   */
  description?: string
}

export interface ResponseItemCreationData {
  resourceId: string,
  description?: string
  amount: number
}
