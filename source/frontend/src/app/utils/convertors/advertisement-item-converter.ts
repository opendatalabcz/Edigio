import {Injectable} from "@angular/core";
import {MultilingualTextConverter} from "./multilingual-text-converter";
import {isObjectNotNullOrUndefined} from "../predicates/object-predicates";
import {AdvertisementItem} from "../../models/advertisement/advertisement-item";
import {AdvertisementItemCreationDto} from "../../dto/advertisement-item";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementItemConverter {
  constructor(
    private multilingualTextConverter: MultilingualTextConverter
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
}
