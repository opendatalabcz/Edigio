import {Injectable} from '@angular/core';
import {AdvertisementFilter} from "../models/projects/advertisement/advertisement-filter";
import {
  Advertisement,
  AdvertisementStatus,
  AdvertisementType,
  AdvertisementVisibility
} from "../models/projects/advertisement/advertisement";
import {MultilingualText} from "../models/common/multilingual-text";
import {map, Observable, timer} from "rxjs";
import {firstDateEarlierOrTheSameAsSecondDate} from "../utils/predicates/date-predicates";
import {isArrayNullUndefinedOrEmpty} from "../utils/array-utils";

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
    },
  ]

  private advertisementMatchesFilter(advertisement: Advertisement, filter: AdvertisementFilter) {
    return (
      (!filter.text
        || advertisement.title.textWithSameLanguageOrDefaultContains(filter.text)
        || advertisement.description.textWithSameLanguageOrDefaultContains(filter.text)
      )
      &&
      (!filter.publishedAfter || (
          advertisement.lastApprovalDate
          && firstDateEarlierOrTheSameAsSecondDate(filter.publishedAfter, advertisement.lastApprovalDate)
        )
      )
      &&
      (!filter.publishedBefore || (
          advertisement.lastApprovalDate
          && firstDateEarlierOrTheSameAsSecondDate(advertisement.lastApprovalDate, filter.publishedBefore)
        )
      )
      &&
      (!filter.status || filter.status === advertisement.status)
      &&
      (isArrayNullUndefinedOrEmpty(filter.type) || filter.type.indexOf(advertisement.type) >= 0)
    )
  }

  private advertisementMatchesSlugAndFilter(advertisement: Advertisement, slug: string, filter: AdvertisementFilter) {
    return !!advertisement.projectsSlugs.find(advertSlug => advertSlug.localeCompare(slug) === 0)
      && this.advertisementMatchesFilter(advertisement, filter)
  }

  public getAllByProjectSlugAndFilter$(slug: string, filter: AdvertisementFilter): Observable<Advertisement[]> {
    return timer(600)
      .pipe(map(() => this.advertisements
        .filter(advert => this.advertisementMatchesSlugAndFilter(advert, slug, filter))
      ))
  }

}
