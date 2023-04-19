import {Injectable} from "@angular/core";
import {
  AdvertisementTemplatePreview,
  AdvertisementTemplateShort
} from "../../models/advertisement/advertisement-template";
import {MultilingualTextConverter} from "./multilingual-text-converter";
import {AdvertisementTemplatePreviewDto, AdvertisementTemplateShortDto} from "../../dto/advertisement-template";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementTemplateConverter {
  constructor(private multilingualTextConverter: MultilingualTextConverter) {}

  shortDtoToShortModel(dto: AdvertisementTemplateShortDto) : AdvertisementTemplateShort {
    return {
      name: this.multilingualTextConverter.dtoToModel(dto.name),
      id: dto.slug
    }
  }

  previewDtoToPreviewModel(dto: AdvertisementTemplatePreviewDto) : AdvertisementTemplatePreview {
    return {
      name: this.multilingualTextConverter.dtoToModel(dto.name),
      description: this.multilingualTextConverter.dtoToModel(dto.description),
      id: dto.slug
    }
  }
}
