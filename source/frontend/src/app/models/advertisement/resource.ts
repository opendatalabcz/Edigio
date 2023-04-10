import {MultilingualText} from "../common/multilingual-text";

export interface Resource {
  id: string,
  name: MultilingualText,
  description: MultilingualText,
}

export interface ResourceShort {
  id: string,
  name: MultilingualText
}

export interface ResourceBasedListedItem {

}

export interface ListedItem {
  id?: string
  resource: ResourceShort,
  amount: number
  /**
   * Differs from resource description,
   * as this field should give additional information related to the listem item itself, instead of resource in general
   */
  description?: MultilingualText
}
