import {PublishedDateFilter} from "../../common/common-filters";
import {LocalizedText} from "../../common/multilingual-text";
import {AdvertisementStatus, AdvertisementType, AdvertisementVisibility} from "./advertisement";

export interface AdvertisementFilter extends PublishedDateFilter {
  /**
   * Part of text that should be present in advertisement
   *  - title
   *  - description
   */
  text?: LocalizedText
  type?: AdvertisementType
  status?: AdvertisementStatus
  visibility?: AdvertisementVisibility
}
