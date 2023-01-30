import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ProjectService} from "../../../services/project.service";
import {beforeAfterValidator} from "../../../validators/before-after-validators";
import {AdvertisementFilter} from "../../../models/projects/advertisement/advertisement-filter";
import {Advertisement, AdvertisementType} from "../../../models/projects/advertisement/advertisement";
import {AdvertisementService} from "../../../services/advertisement.service";
import {first, map, mergeMap, of} from "rxjs";
import {GridItem} from "../../../models/preview-grid/grid-item";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {MultilingualText} from "../../../models/common/multilingual-text";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {optDateToUrlParam, optUrlParamToDate} from "../../../utils/url-params-utils";

@Component({
  selector: 'app-help-list',
  templateUrl: './help-list.component.html',
  styleUrls: ['./help-list.component.scss']
})
export class HelpListComponent implements OnInit{
  private readonly publishDateBeforeAfterValidationKey = 'publishDateBeforeAfterValidationKey'
  private readonly textKey = 'text'
  private readonly publishedAfterKey = 'publishedAfter'
  private readonly publishedBeforeKey = 'publishedBefore'
  private readonly typeKey = 'type'


  filterForm: FormGroup;
  showBeforeEarlierThanAfterError?: boolean;
  filter: AdvertisementFilter
  advertisements: Advertisement[] = []
  gridItems: GridItem[] = []


  constructor(
    private projectService: ProjectService,
    private advertisementService: AdvertisementService,
    private multilingualTextService: MultilingualTextService,
    private translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.filter = {}
    this.activatedRoute
      .queryParamMap
      .pipe(
        map(paramMap => this.routerQueryParamMapToAdvertisementFilter(paramMap)),
        first()
      ).subscribe(filter => {
      console.log('Parsed filter: ', filter)
      this.filter = filter
    })
    this.filterForm = this.createFilterForm()
  }

  private createFilterForm() : FormGroup {
    return this.fb.group({
      text: this.filter.text?.text,
      publishedBefore: this.filter.publishedBefore,
      publishedAfter: this.filter.publishedAfter,
      types: [this.filter.type]
    }, {
      validators: beforeAfterValidator(
        'publishedAfter', 'publishedBefore', this.publishDateBeforeAfterValidationKey
      )
    })
  }

  private advertisementTypeStringToAdvertisementType(advertisementTypeValue: string) : AdvertisementType | undefined {
    const type = advertisementTypeValue as AdvertisementType
    if(!Object.keys(AdvertisementType).includes(type)) {
      console.error('Given advertisement type value not found, resorting to not set value!')
      return undefined
    }
    return type
  }

  private advertisementTypeDefined(subject?: AdvertisementType): subject is AdvertisementType  {
    return Object.keys(AdvertisementType).includes(subject as AdvertisementType)
  }

  private routerQueryParamMapToAdvertisementFilter(queryParamMap: ParamMap) : AdvertisementFilter {
    const text = queryParamMap.get(this.textKey)
    const advertisementTypeValues = queryParamMap.getAll(this.typeKey)
    return {
      text: text ? {text: text, lang: this.translateService.currentLang} : undefined,
      type: advertisementTypeValues
        .map(typeValue => this.advertisementTypeStringToAdvertisementType(typeValue))
        //Unknown values are returned as undefined in previously used map function,
        // so we need to filter out these values
        .filter(this.advertisementTypeDefined),
      publishedAfter: optUrlParamToDate(queryParamMap.get(this.publishedAfterKey)),
      publishedBefore: optUrlParamToDate(queryParamMap.get(this.publishedBeforeKey))
    }
  }

  ngOnInit() {
    this.projectService.currentProjectSlug$
      .pipe(
        mergeMap(slug => {
          if(slug) {
            return this.advertisementService.getAllByProjectSlugAndFilter$(slug, this.filter)
          } else {
            return of(undefined)
          }
        }),
        first()
      ).subscribe(items => {
      this.advertisements = items ?? []
      this.gridItems = this.advertisements.map(advert => this.advertisementToGridItem(advert))
    })
  }

  private advertisementToGridItem(advertisement: Advertisement) : GridItem {
    return {
      title: this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(advertisement.title),
      text: this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(advertisement.description),
      buttonsData: [{text: of('Hello there'), link: '/projects', isAbsolute: false}],
    }
  }

  private updateFilter(newFilter: AdvertisementFilter) {
    this.filter = newFilter
    this.router.navigate([], {queryParams: {
      text: newFilter.text?.text,
      type: newFilter.type,
      publishedAfter: optDateToUrlParam(newFilter.publishedAfter),
      publishedBefore: optDateToUrlParam(newFilter.publishedBefore)
    }})
  }

  onSubmit(form: FormGroup) {
    const newFilter: AdvertisementFilter = {
      text: {text: form.get(this.textKey)?.value, lang: this.translateService.currentLang},
      type: form.get(this.typeKey)?.value,
      publishedAfter: form.get(this.publishedAfterKey)?.value,
      publishedBefore: form.get(this.publishedBeforeKey)?.value
    }
    this.updateFilter(newFilter)
  }

  public get isFilterFormValid() : boolean {
    return !this.filterForm.errors
  }
}
