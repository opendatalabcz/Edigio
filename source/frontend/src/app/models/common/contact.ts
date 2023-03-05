import {Nullable} from "../../utils/types/common";

export interface Contact {
  firstname?: string
  lastname?: string
  email?: string
  telephoneNumber?: Nullable<string>
}

export interface PublishedContactDetailSettings {
  firstname?: boolean
  lastname?: boolean
  email?: boolean
  telephoneNumber?: boolean
}
