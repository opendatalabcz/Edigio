import {Injectable} from '@angular/core';
import {AdvertisementFilter} from "../models/projects/advertisement/advertisement-filter";
import {
  Advertisement,
  AdvertisementShort,
  AdvertisementStatus,
  AdvertisementType,
  AdvertisementVisibility
} from "../models/projects/advertisement/advertisement";
import {MultilingualText} from "../models/common/multilingual-text";
import {filter, map, mergeMap, Observable, tap, timer} from "rxjs";
import {firstDateEarlierOrTheSameAsSecondDate} from "../utils/predicates/date-predicates";
import {isArrayNullUndefinedOrEmpty} from "../utils/array-utils";
import {HttpErrorResponse} from "@angular/common/http";
import {ProjectService} from "./project.service";
import {isNotNullOrUndefined} from "../utils/predicates/object-predicates";
import {Page} from "../models/common/page";
import {pageFromItems} from "../utils/page-utils";
import {PageRequest} from "../models/common/page-request";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  private advertisements: Advertisement[] = [
    {
      id: 'frstofr',
      title: MultilingualText.of({text: 'Nejaka nabidka pomoci', lang: 'cs'}),
      description: MultilingualText.of({text: 'Inzerat ktery nabizi nejakou pomoc potrebnym', lang: 'cs'}),
      type: AdvertisementType.OFFER,
      authorId: 'userHashId',
      creationDate: new Date(2023, 0, 1),
      lastApprovalDate: new Date(2023, 0, 2),
      status: AdvertisementStatus.PUBLISHED,
      visibility: AdvertisementVisibility.PUBLIC,
      projectsSlugs: ['ukrajina']
    }, {
      id: 'frstreq',
      title: MultilingualText.of({text: 'Random zadost o pomoc', lang: 'cs'}),
      description: MultilingualText.of({text: 'Inzerat ve kterem nekdo zada o nejakou pomoc', lang: 'cs'}),
      type: AdvertisementType.REQUEST,
      authorId: 'userHashId',
      creationDate: new Date(2023, 0, 1),
      lastApprovalDate: new Date(2023, 0, 3),
      status: AdvertisementStatus.PUBLISHED,
      visibility: AdvertisementVisibility.PUBLIC,
      projectsSlugs: ['ukrajina']
    }, {
      id: 'authorizedreq',
      title: MultilingualText.of({text: 'Random zadost o pomoc', lang: 'cs'}),
      description: MultilingualText.of({text: 'Inzerat ve kterem nekdo zada o nejakou pomoc', lang: 'cs'}),
      type: AdvertisementType.REQUEST,
      authorId: 'userHashId',
      creationDate: new Date(2023, 0, 1),
      lastApprovalDate: new Date(2023, 0, 3),
      status: AdvertisementStatus.PUBLISHED,
      visibility: AdvertisementVisibility.AUTHORIZED,
      projectsSlugs: ['ukrajina']
    },
  ]

  constructor(private projectService: ProjectService) {
  }


  private advertisementMatchesFilter(advertisement: Advertisement,
                                     advertisementFilter: AdvertisementFilter) {
    return (
      (!advertisementFilter.text
        || advertisement.title.textWithSameLanguageOrDefaultContains(advertisementFilter.text)
        || advertisement.description.textWithSameLanguageOrDefaultContains(advertisementFilter.text)
      )
      &&
      (!advertisementFilter.publishedAfter || (
          advertisement.lastApprovalDate
          && firstDateEarlierOrTheSameAsSecondDate(advertisementFilter.publishedAfter, advertisement.lastApprovalDate)
        )
      )
      &&
      (!advertisementFilter.publishedBefore || (
          advertisement.lastApprovalDate
          && firstDateEarlierOrTheSameAsSecondDate(advertisement.lastApprovalDate, advertisementFilter.publishedBefore)
        )
      )
      &&
      (!advertisementFilter.status || advertisementFilter.status === advertisement.status)
      &&
      (isArrayNullUndefinedOrEmpty(advertisementFilter.type) || advertisementFilter.type.indexOf(advertisement.type) >= 0)
    )
  }

  private advertisementMatchesSlugAndFilter(advertisement: Advertisement, slug: string,
                                            advertisementFilter: AdvertisementFilter) {
    return !!advertisement.projectsSlugs.find(advertSlug => advertSlug.localeCompare(slug) === 0)
      && this.advertisementMatchesFilter(advertisement, advertisementFilter)
  }

  public getPageByProjectSlugAndFilter$(slug: string, filter: AdvertisementFilter, pageRequest: PageRequest)
    : Observable<Page<AdvertisementShort>> {
    return timer(600)
      .pipe(
        map(
          //Not mapping to short variant here, as short is subset of Advertisement,
          // Advertisement satisfies AdvertisementShort interface
          () => this.advertisements.filter(advert => this.advertisementMatchesSlugAndFilter(advert, slug, filter))
        ),
        map(
          (adverts) => pageFromItems(adverts, pageRequest)
        )
      )
  }

  public getPageByFilterAndCurrentProject$(advertisementFilter: AdvertisementFilter, pageRequest: PageRequest)
    : Observable<Page<AdvertisementShort>> {
    return this.projectService.currentProjectSlug$
      .pipe(
        filter(isNotNullOrUndefined),
        mergeMap(slug => this.getPageByProjectSlugAndFilter$(slug, advertisementFilter, pageRequest))
      )
  }

  public getRelativeAdvertisementDetailsLink(advertisementId: string) {
    return `advertisement/${advertisementId}`
  }

  public getAdvertisementDetailsLinkForCurrentProject$(advertisementId: string): Observable<string> {
    return this.projectService.routeRelativeToCurrentProject$(this.getRelativeAdvertisementDetailsLink(advertisementId))
      .pipe(tap(link => console.log('link', link)));
  }

  public getDetailById$(id: string): Observable<Advertisement> {
    return timer(600).pipe(
      map(() => this.advertisements.find(ad => ad.id.localeCompare(id) === 0)),
      tap((value) => {
        if (!value) {
          throw new HttpErrorResponse({status: 404})
        } else if (value.visibility === AdvertisementVisibility.AUTHORIZED) {
          throw new HttpErrorResponse({status: 403})
        }
      }),
      map(result => result as Advertisement)
    )
  }
}
