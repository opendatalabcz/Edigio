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
  spokenLanguages?: ReadOnlyLanguage[]
  publishedDetails?: PublishedContactDetailSettings
  isRegistered?: boolean
}

export interface RatedUser extends User{
  ratingScore: number
}
