import {PublishedContactDetailSettings} from "./contact";
import {ReadOnlyLanguage} from "./language";

export interface User {
  id?: string
  username?: string
  firstname?: string
  lastname?: string
  email?: string
  telephoneNumber?: string
  avatarUrl?: string
  knownLanguages?: ReadOnlyLanguage[]
  publishedDetails?: PublishedContactDetailSettings
}

export interface RatedUser {
  id: string
  username: string
  firstname?: string
  lastname?: string
  email?: string
  telephoneNumber?: string
  avatarUrl?: string
  knownLanguages?: string[]
  ratingScore: number
}
