import {Injectable} from '@angular/core';
import {AdvertisementTemplateFilter} from "../models/advertisement/advertisement-template-filter";
import {
  AdvertisementTemplate,
  AdvertisementTemplatePreview,
  AdvertisementTemplateShort
} from "../models/advertisement/advertisement-template";
import {map, Observable} from "rxjs";
import {firstPageRequest} from "../shared/utils/page-utils";
import {HttpClient} from "@angular/common/http";
import {Page} from "../models/pagination/page";
import {AdvertisementTemplatePreviewDto, AdvertisementTemplateShortDto} from "../dto/advertisement-template";
import {
  ADVERTISEMENT_TEMPLATE_PAGE_REQUEST_API_URL,
  advertisementTemplateAllRecommendedResourcesApiUrl,
  advertisementTemplatePreviewApiUrl
} from "../api-config/advertisement-template-api-config";
import {AdvertisementTemplateConverter} from "../shared/convertors/advertisement-template-converter";
import {ResourceShortDto} from "../dto/resource";
import {ResourceConverter} from "../shared/convertors/resource-converter";
import {ResourceShort} from "../models/advertisement/resource";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementTemplateService {
  constructor(
    private advertisementTemplateConverter: AdvertisementTemplateConverter,
    private resourceConverter: ResourceConverter,
    private httpClient: HttpClient,
  ) {
  }

  findTemplatePreviewById(id: string): Observable<AdvertisementTemplatePreview> {
    return this.httpClient.get<AdvertisementTemplatePreviewDto>(advertisementTemplatePreviewApiUrl(id))
      .pipe(
        map((dto) => {
          return this.advertisementTemplateConverter.previewDtoToPreviewModel(dto)
        })
      )
  }

  findTopNTemplatesByFilter(templateFilter: AdvertisementTemplateFilter, n: number): Observable<AdvertisementTemplateShort[]> {
    return this.httpClient.post<Page<AdvertisementTemplateShortDto>>(
      ADVERTISEMENT_TEMPLATE_PAGE_REQUEST_API_URL,
      {filter: templateFilter, pageRequest: firstPageRequest(n)}
    ).pipe(
      map((page: Page<AdvertisementTemplateShortDto>) => page.items.map((item: AdvertisementTemplateShortDto) => {
          return this.advertisementTemplateConverter.shortDtoToShortModel(item)
        },
      )))
  }

  getResourcesForTemplate(template: AdvertisementTemplate | AdvertisementTemplateShort): Observable<ResourceShort[]> {
    return this.httpClient.get<ResourceShortDto[]>(advertisementTemplateAllRecommendedResourcesApiUrl(template.id))
      .pipe(
        map(shortDtos => {
          return shortDtos.map(dto => this.resourceConverter.shortDtoToShortModel(dto))
        })
      )
  }
}
