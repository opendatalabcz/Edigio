import {Injectable} from '@angular/core';
import {AdvertisementTemplateFilter} from "../models/advertisement/advertisement-template-filter";
import {AdvertisementTemplate, AdvertisementTemplateShort} from "../models/advertisement/advertisement-template";
import {AdvertisementType} from "../models/advertisement/advertisement";
import {CatastropheType} from "../models/projects/catastrophe-type";
import {LocalizedText, MultilingualText} from "../models/common/multilingual-text";
import {first, map, Observable, timer} from "rxjs";
import {containsAny} from "../utils/array-utils";
import {ResourceService} from "./resource.service";
import {AdvertisementHelpType} from "../models/advertisement/advertisement-help-type";
import {firstPageRequest} from "../utils/page-utils";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementTemplateService {
  private advertisementTemplates: AdvertisementTemplate[] = [
    {
      id: 'allmighty-1',
      advertisementTypes: [AdvertisementType.OFFER],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of({languageCode: 'en', text: 'Food'}, {languageCode: 'cs', text: 'Potraviny'}),
      description: MultilingualText.of({
        languageCode: 'en',
        text: 'Advertisement containing water and food'
      },{
        languageCode: 'cs',
        text: 'Inzerát s nabídkou/poptávkou vody či potravin',
      }),
      recommendedResources: [],
      advertisementHelpTypes: Object.values(AdvertisementHelpType)
    },
    {
      id: 'allmighty-2',
      advertisementTypes: [AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of(
        {languageCode: 'en', text: 'Second Allmighty'},
        {languageCode: 'cs', text: 'Druhý všeužitečný'}
      ),
      description: MultilingualText.of(
        {languageCode: 'en', text: 'Second Allmighty template'},
        {languageCode: 'cs', text: 'Druhý všeužitečný template'}
      ),
      recommendedResources: [],
      advertisementHelpTypes: Object.values(AdvertisementHelpType)
    },
    {
      id: 'allmighty-3',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of({languageCode: 'en', text: 'Third Allmighty'}, {languageCode: 'cs', text: 'Třetí všeužitečný'}),
      description: MultilingualText.of({languageCode: 'en', text: 'Third Allmighty template'}, {
        languageCode: 'cs',
        text: 'Třetí všeužitečný template'
      }),
      recommendedResources: [],
      advertisementHelpTypes: Object.values(AdvertisementHelpType)
    },
    {
      id: 'allmighty-4',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of(
        {languageCode: 'en', text: 'Fourth Allmighty'},
        {languageCode: 'cs', text: 'Čtvrtý všeužitečný'}
      ),
      description: MultilingualText.of(
        {languageCode: 'en', text: 'Forth Allmighty template'},
        {languageCode: 'cs', text: 'Čtvrtý všeužitečný template'}
      ),
      recommendedResources: [],
      advertisementHelpTypes: Object.values(AdvertisementHelpType)
    },
    {
      id: 'allmighty-5',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of({languageCode: 'en', text: 'Fifth Allmighty'}, {languageCode: 'cs', text: 'Pátý všeužitečný'}),
      description: MultilingualText.of({languageCode: 'en', text: 'Fifth Allmighty template'}, {
        languageCode: 'cs',
        text: 'Pátý všeužitečný template'
      }),
      recommendedResources: [],
      advertisementHelpTypes: Object.values(AdvertisementHelpType)
    },
    {
      id: 'allmighty-6',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of(
        {languageCode: 'en', text: 'Sixth Allmighty'},
        {languageCode: 'cs', text: 'Šestý všeužitečný'}
      ),
      description: MultilingualText.of(
        {languageCode: 'en', text: 'Sixth Allmighty template'},
        {languageCode: 'cs', text: 'Šestý všeužitečný template'}
      ),
      recommendedResources: [],
      advertisementHelpTypes: Object.values(AdvertisementHelpType)
    },
  ]

  constructor(private resourceService: ResourceService) {
    resourceService.findPageFilteredByName({languageCode: 'cs', text: ''}, firstPageRequest(10))
      .pipe(first())
      .subscribe(resourcesPage => {
        const resources = resourcesPage.items
        for (let i = 0; i < this.advertisementTemplates.length; i++) {
          const count = 1 + (i % resources.length)
          const startIndex = i % (resources.length - 1)
          const possiblyEndIdx = startIndex + count
          const firstPartEndIdx = Math.min(possiblyEndIdx, resources.length)
          this.advertisementTemplates[i].recommendedResources = resources.slice(
            startIndex, possiblyEndIdx
          )
          if(possiblyEndIdx != firstPartEndIdx) {
            this.advertisementTemplates[i].recommendedResources.push(
              ...resources.slice(0, possiblyEndIdx - firstPartEndIdx)
            )
          }
        }
      })
  }


  private nameMatchesFilter(templateName: MultilingualText, filteredTemplateName?: LocalizedText) {
    return !filteredTemplateName || templateName.textWithSameLanguageOrDefaultContains(filteredTemplateName)
  }

  private advertisementTypesMatchFilter(templateAdvertisementTypes: AdvertisementType[],
                                        filteredAdvertisementTypes?: AdvertisementType[]) {
    return !filteredAdvertisementTypes || containsAny(templateAdvertisementTypes, filteredAdvertisementTypes)
  }

  private catastropheTypesMatchFilter(templateCatastropheTypes: CatastropheType[],
                                      filteredCatastropheTypes?: CatastropheType[]) {
    return !filteredCatastropheTypes || containsAny(templateCatastropheTypes, filteredCatastropheTypes)
  }

  private matchesTemplateFilter(advertisementTemplate: AdvertisementTemplate, templateFilter: AdvertisementTemplateFilter) {
    return this.nameMatchesFilter(advertisementTemplate.name, templateFilter.name)
      && this.advertisementTypesMatchFilter(advertisementTemplate.advertisementTypes, templateFilter.advertisementTypes)
      && this.catastropheTypesMatchFilter(advertisementTemplate.catastropheTypes, templateFilter.catastropheTypes)
  }

  findTemplateById(id: string) {
    return timer(200).pipe(
      map(() => this.advertisementTemplates.find((template) => template.id.localeCompare(id)))
    )
  }

  findTemplatesByFilter(templateFilter: AdvertisementTemplateFilter): Observable<AdvertisementTemplate[]> {
    return timer(500).pipe(map(() => this.advertisementTemplates.filter(
      (template) => this.matchesTemplateFilter(template, templateFilter)
    )))
  }

  getResourcesForTemplate(template: AdvertisementTemplate | AdvertisementTemplateShort) {
    return this.findTemplateById(template.id)
      .pipe(map((retrievedTemplate) => retrievedTemplate?.recommendedResources ?? []))
  }
}
