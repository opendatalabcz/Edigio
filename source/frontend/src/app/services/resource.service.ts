import {Injectable} from '@angular/core';
import {Resource, ResourceShort} from "../models/advertisement/resource";
import {LocalizedText} from "../models/common/multilingual-text";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Page} from "../models/pagination/page";
import {PageRequest} from "../models/pagination/page-request";
import {ResourceDto, ResourceShortDto} from "../dto/resource";
import {resourceApiUrl, RESOURCES_PAGE_API_URL} from "../api-config/resource-api-config";
import {ResourceConverter} from "../utils/convertors/resource-converter";
import {mapPageItems} from "../utils/page-utils";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private httpClient: HttpClient,
              private resourceConverter: ResourceConverter) {
  }

  getById$(id: string): Observable<Resource> {
    return this.httpClient.get<ResourceDto>(resourceApiUrl(id))
      .pipe(map(dto => this.resourceConverter.dtoToModel(dto)))
  }

  findPageFilteredByName(resourceNameText: LocalizedText, pageRequest: PageRequest): Observable<Page<ResourceShort>> {
    return this.httpClient.post<Page<ResourceShortDto>>(RESOURCES_PAGE_API_URL, {
      filter: {name: resourceNameText},
      pageRequest
    })
      .pipe(map(page => mapPageItems(
            page,
            (dto: ResourceShortDto) => this.resourceConverter.shortDtoToShortModel(dto)
          )
        )
      )
  }
}
