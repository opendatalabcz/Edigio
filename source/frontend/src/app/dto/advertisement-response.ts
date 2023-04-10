import {Contact} from "../models/common/contact";
import {ResponseItemCreateDto} from "./response-item";

export interface AdvertisementResponseCreationDto {
  advertisementSlug: string,
  contact?: Contact
  listedItems: ResponseItemCreateDto[]
  note?: string
}
