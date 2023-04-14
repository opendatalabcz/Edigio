import {ResponseItemCreateDto, ResponseItemDto} from "./response-item";
import {Contact} from "../models/common/contact";
import {AdvertisementResponseStatus} from "../models/advertisement/advertisement-response";
import {InResponseAdvertisementDto} from "./advertisement";
import {PublicUserInfoDto} from "./user";

export interface AdvertisementResponseCreationDto {
  advertisementSlug: string,
  contact?: Contact
  listedItems: ResponseItemCreateDto[]
  note?: string
}

export interface AdvertisementResponsePreviewDto {
  publicId: string,
  advertisement: InResponseAdvertisementDto,
  listedItems: ResponseItemDto[],
  responderNote?: string
  responder: PublicUserInfoDto,
  status: AdvertisementResponseStatus,
  resolvableByUser: boolean,
  resolvableByToken: boolean,
  createdAt: string,
  resolvedAt?: string,
}

