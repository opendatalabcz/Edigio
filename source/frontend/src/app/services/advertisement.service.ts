import {Injectable} from '@angular/core';
import {AdvertisementFilter} from "../models/advertisement/advertisement-filter";
import {
  Advertisement,
  AdvertisementShort,
  AdvertisementStatus,
  AdvertisementType
} from "../models/advertisement/advertisement";
import {MultilingualText} from "../models/common/multilingual-text";
import {filter, map, mergeMap, Observable, tap, timer} from "rxjs";
import {firstDateEarlierOrTheSameAsSecondDate} from "../utils/predicates/date-predicates";
import {isArrayNullUndefinedOrEmpty} from "../utils/array-utils";
import {HttpErrorResponse} from "@angular/common/http";
import {ProjectService} from "./project.service";
import {isObjectNotNullOrUndefined} from "../utils/predicates/object-predicates";
import {Page} from "../models/pagination/page";
import {pageFromItems} from "../utils/page-utils";
import {PageRequest} from "../models/pagination/page-request";
import {ResourceShort} from "../models/advertisement/resource";
import {ResourceService} from "./resource.service";
import {AdvertisementHelpType} from "../models/advertisement/advertisement-help-type";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  private advertisements: Advertisement[] = [
    {
      id: 'frstofr',
      title: MultilingualText.of({text: 'Nejaka nabidka pomoci', lang: 'cs'}),
      description: MultilingualText.of({
        text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nulla est. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Quisque tincidunt scelerisque libero. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Maecenas sollicitudin. Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci. Morbi scelerisque luctus velit. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Praesent in mauris eu tortor porttitor accumsan. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Phasellus rhoncus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Sed convallis magna eu sem. Nunc auctor. ',
        lang: 'cs'
      }),
      type: AdvertisementType.OFFER,
      helpType: AdvertisementHelpType.PSYCHOLOGICAL_HELP,
      authorId: 'userHashId',
      creationDate: new Date(2023, 0, 1),
      lastApprovalDate: new Date(2023, 0, 2),
      status: AdvertisementStatus.PUBLISHED,
      projectsSlugs: ['ukrajina'],
      listedItems: []
    }, {
      id: 'frstreq',
      title: MultilingualText.of({text: 'Random zadost o pomoc', lang: 'cs'}),
      description: MultilingualText.of({text: 'Inzerat ve kterem nekdo zada o nejakou pomoc', lang: 'cs'}),
      type: AdvertisementType.REQUEST,
      helpType: AdvertisementHelpType.MEDICAL_ASSISTANCE,
      authorId: 'userHashId',
      creationDate: new Date(2023, 0, 1),
      lastApprovalDate: new Date(2023, 0, 3),
      status: AdvertisementStatus.PUBLISHED,
      projectsSlugs: ['ukrajina'],
      listedItems: []
    }, {
      id: 'authorizedreq',
      title: MultilingualText.of({text: 'Random zadost o pomoc', lang: 'cs'}),
      description: MultilingualText.of({text: 'Inzerat ve kterem nekdo zada o nejakou pomoc', lang: 'cs'}),
      type: AdvertisementType.REQUEST,
      helpType: AdvertisementHelpType.OTHER,
      authorId: 'userHashId',
      creationDate: new Date(2023, 0, 1),
      lastApprovalDate: new Date(2023, 0, 3),
      status: AdvertisementStatus.PUBLISHED,
      projectsSlugs: ['ukrajina'],
      listedItems: []
    },
  ]

  constructor(
    private projectService: ProjectService,
    private resourceService: ResourceService
  ) {
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

  public getPageByProjectSlugAndFilter$(slug: string, advertisementFilter: AdvertisementFilter, pageRequest: PageRequest)
    : Observable<Page<AdvertisementShort>> {
    return timer(600)
      .pipe(
        map(
          //Not mapping to short variant here, as short is subset of Advertisement,
          // Advertisement satisfies AdvertisementShort interface
          () => this.advertisements.filter(advert => {
            return this.advertisementMatchesSlugAndFilter(advert, slug, advertisementFilter)
          })
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
        filter(isObjectNotNullOrUndefined),
        mergeMap(slug => this.getPageByProjectSlugAndFilter$(slug, advertisementFilter, pageRequest))
      )
  }

  public getRelativeAdvertisementDetailsLink(advertisementId: string) {
    return `advertisement/${advertisementId}`
  }

  public getAdvertisementDetailsLinkForCurrentProject$(advertisementId: string): Observable<string> {
    return this.projectService.routeRelativeToCurrentProject$(this.getRelativeAdvertisementDetailsLink(advertisementId))
  }

  public getDetailById$(id: string): Observable<Advertisement> {
    return timer(600).pipe(
      mergeMap(() => this.resourceService.findPageByName({text: '', lang: 'en'})),
      map((resources: ResourceShort[]) => {
        const ad = this.advertisements.find(advert => advert.id.localeCompare(id) === 0)
        if (ad) {
          ad.listedItems = [
            {id: 'li1', resource: resources[0], description: resources[0].name, amount: 1},
            {id: 'li2', resource: resources[1], description: resources[1].name, amount: 1},
          ]
        }
        return ad
      }),
      tap((value) => {
        if (!value) {
          throw new HttpErrorResponse({status: 404})
        }
      }),
      map(result => result as Advertisement)
    )
  }
}
