import {LocalizedText, MultilingualText} from "../common/multilingual-text";
import {CatastropheType} from "../projects/catastrophe-type";
import {AdvertisementType} from "./advertisement";

export interface AdvertisementTemplateFilter {
  name?: LocalizedText,
  catastropheTypes?: CatastropheType[]
  advertisementTypes?: AdvertisementType[]
}
