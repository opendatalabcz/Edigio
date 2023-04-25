import {ProjectShort} from "../../models/projects/project";
import {Injectable} from "@angular/core";
import {CatastropheType} from "../../models/projects/catastrophe-type";
import {ProjectShortDto} from "../../dto/project";
import {MultilingualTextConverter} from "./multilingual-text-converter";
import {ProjectDetailsIntroPage} from "../../models/projects/projectPages";
import {ProjectDetailsIntroPageDto} from "../../dto/projectPages";

@Injectable({
  providedIn: 'root'
})
export class ProjectConverter {
  constructor(private multilingualTextConverter: MultilingualTextConverter) {
  }


  public projectShortDtoToProjectShort(dto: ProjectShortDto): ProjectShort {
    return {
      title: this.multilingualTextConverter.dtoToModel(dto.title),
      description: this.multilingualTextConverter.dtoToModel(dto.description),
      status: dto.status,
      slug: dto.slug
    }
  }

  public projectDetailsIntroPageDtoToProjectDetailsIntroPage(dto: ProjectDetailsIntroPageDto): ProjectDetailsIntroPage {
    return {
      title: this.multilingualTextConverter.dtoToModel(dto.title),
      description: this.multilingualTextConverter.dtoToModel(dto.description),
      gallerySlug: ""
    }
  }

  public catastropheTypeStringToCatastropheType(catastropheTypeString: string): CatastropheType {
    const catastropheType = catastropheTypeString as CatastropheType
    if (!Object.values(CatastropheType).includes(catastropheType)) {
      throw new Error('Given catastrophe type string is not valid catastrophe type! ' + catastropheTypeString)
    }
    return catastropheType
  }
}
