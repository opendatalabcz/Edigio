import {LocalizedText} from "../common/multilingual-text";
import {CatastropheType} from "../projects/catastrophe-type";
import {AdvertisementType} from "./advertisement";
import {AdvertisementHelpType} from "./advertisement-help-type";

export interface AdvertisementTemplateFilter {
  name?: LocalizedText,
  catastropheTypes?: CatastropheType[]
  advertisementTypes?: AdvertisementType[]
  advertisementHelpTypes?: AdvertisementHelpType[]
  projectSlugs?: string[]
}
