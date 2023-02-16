import {MultilingualText} from "../common/multilingual-text";
import {CatastropheType} from "../projects/catastrophe-type";
import {AdvertisementType} from "./advertisement";

export interface AdvertisementTemplate {
  id: string
  name: MultilingualText,
  description: MultilingualText,
  creationDate?: Date,
  lastEditDate?: Date
  catastropheTypes: CatastropheType[]
  advertisementTypes: AdvertisementType[]
}
