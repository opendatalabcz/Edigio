import {MultilingualText} from "../common/multilingual-text";
import {CatastropheType} from "../projects/catastrophe-type";
import {AdvertisementType} from "./advertisement";
import {Resource, ResourceShort} from "./resource";
import {AdvertisementHelpType} from "./advertisement-help-type";

export interface AdvertisementTemplate {
  id: string
  name: MultilingualText,
  description: MultilingualText,
  creationDate?: Date,
  lastEditDate?: Date
  catastropheTypes: CatastropheType[]
  advertisementTypes: AdvertisementType[],
  advertisementHelpTypes: AdvertisementHelpType[]
  recommendedResources: ResourceShort[]
}

export interface AdvertisementTemplateShort {
  id: string,
  name: MultilingualText
}
