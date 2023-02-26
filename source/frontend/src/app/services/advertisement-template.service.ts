import {Injectable} from '@angular/core';
import {AdvertisementTemplateFilter} from "../models/advertisement/advertisement-template-filter";
import {AdvertisementTemplate, AdvertisementTemplateShort} from "../models/advertisement/advertisement-template";
import {AdvertisementType} from "../models/advertisement/advertisement";
import {CatastropheType} from "../models/projects/catastrophe-type";
import {LocalizedText, MultilingualText} from "../models/common/multilingual-text";
import {first, map, Observable, timer} from "rxjs";
import {containsAny} from "../utils/array-utils";
import {ResourceService} from "./resource.service";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementTemplateService {
  private advertisementTemplates: AdvertisementTemplate[] = [
    {
      id: 'allmighty-1',
      advertisementTypes: [AdvertisementType.OFFER],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of({lang: 'en', text: 'First Allmighty'}, {lang: 'cs', text: 'První všeužitečný'}),
      description: MultilingualText.of({lang: 'en', text: 'First Allmighty template'}, {
        lang: 'cs',
        text: 'První všeužitečný template'
      }),
      recommendedResources: []
    },
    {
      id: 'allmighty-2',
      advertisementTypes: [AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of(
        {lang: 'en', text: 'Second Allmighty'},
        {lang: 'cs', text: 'Druhý všeužitečný'}
      ),
      description: MultilingualText.of(
        {lang: 'en', text: 'Second Allmighty template'},
        {lang: 'cs', text: 'Druhý všeužitečný template'}
      ),
      recommendedResources: []
    },
    {
      id: 'allmighty-3',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of({lang: 'en', text: 'Third Allmighty'}, {lang: 'cs', text: 'Třetí všeužitečný'}),
      description: MultilingualText.of({lang: 'en', text: 'Third Allmighty template'}, {
        lang: 'cs',
        text: 'Třetí všeužitečný template'
      }),
      recommendedResources: []
    },
    {
      id: 'allmighty-4',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of(
        {lang: 'en', text: 'Fourth Allmighty'},
        {lang: 'cs', text: 'Čtvrtý všeužitečný'}
      ),
      description: MultilingualText.of(
        {lang: 'en', text: 'Forth Allmighty template'},
        {lang: 'cs', text: 'Čtvrtý všeužitečný template'}
      ),
      recommendedResources: []
    },
    {
      id: 'allmighty-5',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of({lang: 'en', text: 'Fifth Allmighty'}, {lang: 'cs', text: 'Pátý všeužitečný'}),
      description: MultilingualText.of({lang: 'en', text: 'Fifth Allmighty template'}, {
        lang: 'cs',
        text: 'Pátý všeužitečný template'
      }),
      recommendedResources: []
    },
    {
      id: 'allmighty-6',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType),
      name: MultilingualText.of(
        {lang: 'en', text: 'Sixth Allmighty'},
        {lang: 'cs', text: 'Šestý všeužitečný'}
      ),
      description: MultilingualText.of(
        {lang: 'en', text: 'Sixth Allmighty template'},
        {lang: 'cs', text: 'Šestý všeužitečný template'}
      ),
      recommendedResources: []
    },
    {
      id: 'war-only',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: [CatastropheType.WAR],
      name: MultilingualText.of(
        {lang: 'en', text: 'War only'},
        {lang: 'cs', text: 'Pouze valka'}
      ),
      description: MultilingualText.of(
        {lang: 'en', text: 'Template specialized for war'},
        {lang: 'cs', text: 'Template specializovaný pro válku'}
      ),
      recommendedResources: []
    },
    {
      id: 'no-war',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.values(CatastropheType).filter(value => value !== CatastropheType.WAR),
      name: MultilingualText.of(
        {lang: 'en', text: 'No war'},
        {lang: 'cs', text: 'Bez války'}
      ),
      description: MultilingualText.of(
        {lang: 'en', text: 'Template without war'},
        {lang: 'cs', text: 'Template pro vše kromě války'}
      ),
      recommendedResources: []
    },
  ]

  constructor(private resourceService: ResourceService) {
    resourceService.findPageByName({lang: 'cs', text: ''})
      .pipe(first())
      .subscribe(resources => {
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
