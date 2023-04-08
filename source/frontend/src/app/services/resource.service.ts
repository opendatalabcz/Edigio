import {Injectable} from '@angular/core';
import {Resource, ResourceShort} from "../models/advertisement/resource";
import {LocalizedText, MultilingualText} from "../models/common/multilingual-text";
import {map, Observable, tap, timer} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Page} from "../models/pagination/page";
import {PageRequest} from "../models/pagination/page-request";
import {ResourceShortDto} from "../dto/resource";
import {RESOURCES_PAGE_API_URL} from "../api-config/resource-api-config";
import {ResourceConverter} from "../utils/convertors/resource-converter";
import {mapPageItems} from "../utils/page-utils";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private httpClient: HttpClient,
              private resourceConverter: ResourceConverter) {
  }


  private resources: Resource[] = [
    {
      id: 'megausefulthing',
      name: MultilingualText.of(
        {text: 'Nahodna vec', languageCode: 'cs'},
        {text: 'Random item', languageCode: 'en'}
      ),
      description: MultilingualText.of(
        {
          text: 'Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec.',
          languageCode: 'cs'
        },
        {text: 'Mega useful random item', languageCode: 'cs'}
      ),
      galleryId: 'usefulthinggallery'
    },
    {
      id: 'moremegausefulthing',
      name: MultilingualText.of(
        {text: 'Nahodnejsi vec', languageCode: 'cs'},
        {text: 'More random item', languageCode: 'en'}
      ),
      description: MultilingualText.of(
        {
          text: 'Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec.',
          languageCode: 'cs'
        },
        {text: 'Mega useful random item', languageCode: 'cs'}
      ),
      galleryId: 'usefulthinggallery'
    },
    {
      id: 'muchmoremegausefulthing',
      name: MultilingualText.of(
        {text: 'Mnohem nahodnejsi vec', languageCode: 'cs'},
        {text: 'Much more random item', languageCode: 'en'}
      ),
      description: MultilingualText.of(
        {
          text: 'Mnohem mega vice uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec.',
          languageCode: 'cs'
        },
        {text: 'Much mega more useful random item', languageCode: 'cs'}
      ),
      galleryId: 'usefulthinggallery'
    }
  ]

  getAllResourcesByIds$(ids: string[]): Observable<ResourceShort[]> {
    return timer(300).pipe(map(() => this.resources.filter(res => ids.indexOf(res.id) >= 0)))
  }

  getById$(id: string) {
    return timer(300).pipe(
      map(() => this.resources.find(res => !res.id.localeCompare(id))),
      tap((resource) => {
        if (!resource) {
          throw new HttpErrorResponse({status: 404, statusText: id})
        }
      })
    )
  }

  findPageFilteredByName(resourceNameText: LocalizedText, pageRequest: PageRequest): Observable<Page<ResourceShort>> {
    return this.httpClient.post<Page<ResourceShortDto>>(RESOURCES_PAGE_API_URL, {
      filter: {name: resourceNameText},
      pageRequest
    })
      .pipe(map(page => mapPageItems(
            page,
            (dto: ResourceShortDto) => this.resourceConverter.resourceShortDtoToResourceShort(dto)
          )
        )
      )
  }
}
