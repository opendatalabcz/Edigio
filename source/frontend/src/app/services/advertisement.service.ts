import {Injectable} from '@angular/core';
import {AdvertisementFilter} from "../models/advertisement/advertisement-filter";
import {
  AdvertisementCreationData,
  AdvertisementDetail,
  AdvertisementShort
} from "../models/advertisement/advertisement";
import {filter, map, mergeMap, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ProjectService} from "./project.service";
import {isObjectNotNullOrUndefined} from "../utils/predicates/object-predicates";
import {Page} from "../models/pagination/page";
import {mapPageItems} from "../utils/page-utils";
import {PageRequest} from "../models/pagination/page-request";
import {ResourceService} from "./resource.service";
import {
  ADVERTISEMENT_CREATION_API_URL,
  ADVERTISEMENT_PAGE_API, advertisementCancelApiUrl,
  advertisementDetailApiUrl, advertisementResolveApiUrl
} from "../api-config/advertisement-api-config";
import {AdvertisementConverter} from "../utils/convertors/advertisement-converter";
import {AdvertisementDetailDto, AdvertisementShortDto} from "../dto/advertisement";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {

  constructor(
    private projectService: ProjectService,
    private resourceService: ResourceService,
    private advertisementConverter: AdvertisementConverter,
    private httpClient: HttpClient
  ) {
  }

  public getPageByFilter$(advertisementFilter: AdvertisementFilter, pageRequest: PageRequest)
    : Observable<Page<AdvertisementShort>> {
    return this.httpClient
      .post<Page<AdvertisementShortDto>>(ADVERTISEMENT_PAGE_API, {
        filter: advertisementFilter,
        pageRequest: pageRequest,
      })
      .pipe(map(dtosPage => mapPageItems(
        dtosPage,
        (dto) => this.advertisementConverter.shortDtoToShortModel(dto)))
      )

  }

  public getPageByFilterWithCurrentProject$(advertisementFilter: AdvertisementFilter, pageRequest: PageRequest)
    : Observable<Page<AdvertisementShort>> {
    return this.projectService.currentProjectSlug$
      .pipe(
        filter(isObjectNotNullOrUndefined),
        mergeMap(projectSlug => this.getPageByFilter$(
          {...advertisementFilter, projectSlug},
          pageRequest
        ))
      )
  }

  public getRelativeAdvertisementDetailsLink(advertisementId: string) {
    return `advertisement/${advertisementId}`
  }

  public getAdvertisementDetailsLinkForCurrentProject$(advertisementId: string): Observable<string> {
    return this.projectService.routeRelativeToCurrentProject$(this.getRelativeAdvertisementDetailsLink(advertisementId))
  }

  public getDetailById$(id: string): Observable<AdvertisementDetail> {
    return this.httpClient.get<AdvertisementDetailDto>(advertisementDetailApiUrl(id))
      .pipe(
        map(dto => this.advertisementConverter.detailDtoToDetailModel(dto))
      )
  }

  public create(creationData: AdvertisementCreationData): Observable<string> {
    return this.httpClient.post<string>(
      ADVERTISEMENT_CREATION_API_URL,
      this.advertisementConverter.creationDataToCreationDto(creationData)
    )
  }

  public resolve(slug: string, token?: string) {
    return this.httpClient.post<void>(advertisementResolveApiUrl(slug, token), null)
  }

  public cancel(slug: string, token?: string) {
    return this.httpClient.post<void>(advertisementCancelApiUrl(slug, token), null)
  }
}
