import {Contact} from "./contact";
import {Message} from "./message";

export interface ContactFormData extends Contact {
  repeatEmail?: string
  repeatTelephoneNumber?: string
}
