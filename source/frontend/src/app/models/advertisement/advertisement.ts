import {MultilingualText} from "../common/multilingual-text";
import {AdvertisedItem} from "./advertised-item";
import {AdvertisementHelpType} from "./advertisement-help-type";
import {Link} from "../common/link";

/**
 * Type of advertisement saying whether advertisement is an offer or a request
 */
export enum AdvertisementType {
  OFFER='offer', REQUEST='request'
}

/**
 * Status of advertisement
 */
export enum AdvertisementStatus {
  /**
   * Advertisement was newly created and wasn't approved yet
   *
   * Might not be used when editor is someone who also has right to approve
   */
  CREATED='created',
  /**
   * Advertisement was approved and is accessible to desired range of users (everyone, approved agencies...)
   */
  PUBLISHED='published',
  /**
   * Advertisement was edited, and now waits to approve.
   *
   * Might not be used when editor is someone who also has right to approve
   */
  EDITED='edited',
  /**
   * Advertisement was cancelled - approver might have decided that the advertisement is not publishable
   * or author might have decided that there's no chance for others to react,
   * so he doesn't want to keep it published anymore.
   *
   * THIS STATE IS NOT TO BE USED WHEN ADVERTISEMENT WAS [PARTIALLY] RESOLVED
   *
   */
  CANCELED='cancelled',
  /**
   * Part of advertisement was fulfilled, but there still remain parts which weren't satisfied
   */
  PARTIALLY_RESOLVED='partially-resolved',
  /**
   * Everything required/offered by advertisement was fulfilled
   */
  RESOLVED='resolved'
}

/**
 * Flag saying whether advertisement is visible to public or to people or other subjects,
 * who are authorized to view special kind of advertisemnt (they are typically more verified, than regular users)
 */
export enum AdvertisementVisibility {
  /**
   * Only authorized subjects can view the advertisement - owner, coordinators, approved organizations...
   */
  AUTHORIZED='authorized',
  /**
   * Anyone, even non-registered users, are able to view the advertisement
   */
  PUBLIC='public'
}

/**
 * Title of an Advertisement, and link to details page of an advertisement
 */
export interface AdvertisementTitleAndLink {
  /**
   * Localized title of the advertisement
   */
  title: MultilingualText
  /**
   * Link leading to advertisement details, usable in application
   */
  inAppLink: string
}

export interface AdvertisementShort {
  /**
   * Identifier of the Advertisement
   */
  id: string
  /**
   * Localized title of the Advertisement
   */
  title: MultilingualText
  /**
   * Localized description of the Advertisement
   */
  description: MultilingualText
  /**
   * Type of the Advertisement
   */
  type: AdvertisementType
}

/**
 * Basic advertisement information
 */
export interface AdvertisementInfo {
  title: MultilingualText
  description: MultilingualText
  type: AdvertisementType
  helpType: AdvertisementHelpType
}


export interface ExtendedAdvertisementInfo extends AdvertisementInfo{
  creationDate: Date
  lastApprovalDate?: Date
}

/**
 * Help request or help offer
 */
export interface Advertisement extends ExtendedAdvertisementInfo{
  /**
   * Identifier that can be used to reference advertisement on server side (most likely hash id)
   */
  id: string
  /**
   * User who created the advertisement
   */
  authorId: string
  /**
   * Coordinator or Admin, who approved the last change of advertisement
   */
  approverId?: string
  /**
   * The last time advertisement was edited
   */
  lastEditDate?: Date
  /**
   * User who was the last one to edit the advertisement
   */
  editorId?: string
  /**
   * Current status of the advertisement
   */
  status: AdvertisementStatus
  /**
   * Visibility of the advertisement.
   * Kinda tied to status of the advertisement
   */
  visibility: AdvertisementVisibility
  /**
   * Projects to which advertisement is bound
   *
   * Right now we only bind advertisement to single project,
   * but later it's expected to have advertisements, that might be bound to multiple projects
   * (so resources reusability is improved). That's the reason why array of slugs (which work as an IDss) is kept.
   */
  projectsSlugs: string[]
  /**
   * Items that are offered or requested by advertisement
   */
  listedItems: AdvertisedItem[]
}

/**
 * Structure of advertisement listed in response
 */
export interface InResponseAdvertisement {
  id: string
  title: MultilingualText
  type: AdvertisementType
}
