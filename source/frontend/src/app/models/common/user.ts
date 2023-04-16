import {Contact, PublishedContactDetailSettings} from "./contact";
import {ReadOnlyLanguage} from "./language";

export enum UserRole {
  ANONYMOUS_USER = "anonymous_user",
  USER = "user",
  COORDINATOR = "coordinator",
  ADMIN = "admin"
}

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
}

export interface LoggedUserInfo {
  id?: string
  username?: string
  role?: UserRole
}

export interface RatedUser extends User{
  ratingScore: number
}

export interface AnonymousUserInfoCreationData {
  contact: Contact
  spokenLanguages?: ReadOnlyLanguage[]
  publishedContactDetail: PublishedContactDetailSettings
}

export interface UserRegistrationData {
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  telephoneNumber?: string,
  password: string,
}
