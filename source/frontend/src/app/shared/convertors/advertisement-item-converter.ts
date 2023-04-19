import {Injectable} from "@angular/core";
import {MultilingualTextConverter} from "./multilingual-text-converter";
import {isObjectNotNullOrUndefined} from "../predicates/object-predicates";
import {AdvertisementItem} from "../../models/advertisement/advertisement-item";
import {AdvertisementItemCreationDto, AdvertisementItemDto} from "../../dto/advertisement-item";
import {ResourceConverter} from "./resource-converter";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementItemConverter {
  constructor(
    private multilingualTextConverter: MultilingualTextConverter,
    private resourceConverter: ResourceConverter
  ) {
  }

  public modelToCreationDto(model: AdvertisementItem): AdvertisementItemCreationDto {
    const description = isObjectNotNullOrUndefined(model.description)
      ? this.multilingualTextConverter.modelToDto(model.description) : undefined
    return {
      resourceSlug: model.resource.id,
      description,
      amount: model.amount
    }
  }

  public dtoToModel(dto: AdvertisementItemDto): AdvertisementItem {
    const description = isObjectNotNullOrUndefined(dto.description)
        ? this.multilingualTextConverter.dtoToModel(dto.description) : undefined
    return {
      id: dto.id,
      resource: this.resourceConverter.shortDtoToShortModel(dto.resource),
      description: description,
      amount: dto.amount
    }
  }
}
