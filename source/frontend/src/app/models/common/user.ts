export interface RatedUser {
  id: string
  username: string
  firstname?: string
  lastname?: string
  email?: string
  telephoneNumber?: string
  avatarUrl?: string
  spokenLanguages?: string
  ratingScore: number
}
