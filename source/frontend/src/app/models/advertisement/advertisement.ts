import {MultilingualText} from "../common/multilingual-text";
import {ListedItem} from "./resource";

export enum AdvertisementType {
  OFFER='offer', REQUEST='request'
}

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

export interface AdvertisementShort {
  id: string
  title: MultilingualText
  description: MultilingualText
  type: AdvertisementType
}

/**
 * Help request or help offer
 */
export interface Advertisement {
  /**
   * Identifier that can be used to reference advertisement on server side (most likely hash id)
   */
  id: string
  title: MultilingualText
  description: MultilingualText
  creationDate: Date
  authorId: string
  lastApprovalDate?: Date
  approverId?: string
  lastEditDate?: Date
  editorId?: string
  status: AdvertisementStatus
  visibility: AdvertisementVisibility
  type: AdvertisementType
  /**
   * Projects to which advertisement is bound
   *
   * Right now we only bind advertisement to single project,
   * but later it's expected to have advertisements, that might be bound to multiple projects
   * (so resources reusability is improved). That's the reason why array of slugs (which work as an IDss) is kept.
   */
  projectsSlugs: string[]
  listedItems: ListedItem[]
}
