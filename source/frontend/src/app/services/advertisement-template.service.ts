import {Injectable} from '@angular/core';
import {AdvertisementTemplateFilter} from "../models/advertisement/advertisement-template-filter";
import {AdvertisementTemplate} from "../models/advertisement/advertisement-template";
import {AdvertisementType} from "../models/advertisement/advertisement";
import {CatastropheType} from "../models/projects/catastrophe-type";
import {MultilingualText} from "../models/common/multilingual-text";
import {map, Observable, of, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementTemplateService {
  private advertisementTemplates: AdvertisementTemplate[] = [
    {
      id: 'allmighty-1',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.keys(AdvertisementType).map(value => value as CatastropheType),
      name: MultilingualText.of({lang: 'en', text: 'First Allmighty'}, {lang: 'cs', text: 'První všeužitečný'}),
      description: MultilingualText.of({lang: 'en', text: 'First Allmighty template'}, {lang: 'cs',text: 'První všeužitečný template'}),
    },
    {
      id: 'allmighty-2',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.keys(AdvertisementType).map(value => value as CatastropheType),
      name: MultilingualText.of(
        {lang: 'en', text: 'Second Allmighty'},
        {lang: 'cs', text: 'Druhý všeužitečný'}
      ),
      description: MultilingualText.of(
        {lang: 'en', text: 'Second Allmighty template'},
        {lang: 'cs',text: 'Druhý všeužitečný template'}
      ),
    },
    {
      id: 'allmighty-3',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.keys(AdvertisementType).map(value => value as CatastropheType),
      name: MultilingualText.of({lang: 'en', text: 'Third Allmighty'}, {lang: 'cs', text: 'Třetí všeužitečný'}),
      description: MultilingualText.of({lang: 'en', text: 'Third Allmighty template'}, {lang: 'cs',text: 'Třetí všeužitečný template'}),
    },
    {
      id: 'allmighty-4',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.keys(AdvertisementType).map(value => value as CatastropheType),
      name: MultilingualText.of(
        {lang: 'en', text: 'Fourth Allmighty'},
        {lang: 'cs', text: 'Čtvrtý všeužitečný'}
      ),
      description: MultilingualText.of(
        {lang: 'en', text: 'Forth Allmighty template'},
        {lang: 'cs',text: 'Čtvrtý všeužitečný template'}
      ),
    },
    {
      id: 'allmighty-5',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.keys(AdvertisementType).map(value => value as CatastropheType),
      name: MultilingualText.of({lang: 'en', text: 'Fifth Allmighty'}, {lang: 'cs', text: 'Pátý všeužitečný'}),
      description: MultilingualText.of({lang: 'en', text: 'Fifth Allmighty template'}, {lang: 'cs',text: 'Pátý všeužitečný template'}),
    },
    {
      id: 'allmighty-6',
      advertisementTypes: [AdvertisementType.OFFER, AdvertisementType.REQUEST],
      catastropheTypes: Object.keys(AdvertisementType).map(value => value as CatastropheType),
      name: MultilingualText.of(
        {lang: 'en', text: 'Sixth Allmighty'},
        {lang: 'cs', text: 'Šestý všeužitečný'}
      ),
      description: MultilingualText.of(
        {lang: 'en', text: 'Sixth Allmighty template'},
        {lang: 'cs',text: 'Šestý všeužitečný template'}
      ),
    }
  ]

  findTemplatesByFilter(templateFilter: AdvertisementTemplateFilter) : Observable<AdvertisementTemplate[]> {
    console.dir(templateFilter)
    return timer(500).pipe(map(() => this.advertisementTemplates.filter((template) => {
      return !templateFilter.name || template.name.textWithSameLanguageOrDefaultContains(templateFilter.name)
    })))
  }
}
