import {Nullable} from "../../utils/types/common";

export interface Contact {
  firstname?: string
  lastname?: string
  email?: string
  telephoneNumber?: Nullable<string>
}

export interface PublishedContactDetailSettings {
  lastname: boolean
  email: boolean
  telephoneNumber: boolean
}
