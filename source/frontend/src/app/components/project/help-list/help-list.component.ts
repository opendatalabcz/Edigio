import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {beforeAfterValidator} from "../../../validators/before-after-validators";
import {AdvertisementFilter} from "../../../models/advertisement/advertisement-filter";
import {
  Advertisement,
  AdvertisementShort,
  AdvertisementType
} from "../../../models/advertisement/advertisement";
import {AdvertisementService} from "../../../services/advertisement.service";
import {catchError, first, map, Observable} from "rxjs";
import {GridItem} from "../../../models/preview-grid/grid-item";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {optDateToUrlParam, optUrlParamToDate} from "../../../utils/url-params-utils";
import {LoadingType, NotificationService} from "../../../services/notification.service";
import {universalHttpErrorResponseHandler} from "../../../utils/error-handling-functions";
import {PageRequest} from "../../../models/pagination/page-request";
import {SortDirection} from "../../../models/common/sort-direction";
import {Link} from "../../../models/common/link";

@Component({
  selector: 'app-help-list',
  templateUrl: './help-list.component.html',
  styleUrls: ['./help-list.component.scss']
})
export class HelpListComponent implements OnInit{
  protected readonly publishDateBeforeAfterValidationKey = 'publishDateBeforeAfterValidationKey'
  protected readonly textKey = 'text'
  protected readonly includeOffersKey = 'includeOffers'
  protected readonly includeRequestsKey = 'includeRequests'
  protected readonly publishedAfterKey = 'publishedAfter'
  protected readonly publishedBeforeKey = 'publishedBefore'
  protected readonly typeKey = 'type'

  private currentPageRequest : PageRequest = {num: 0, size: 8, sortDirection: SortDirection.DESCENDING}

  filterForm: FormGroup;
  showBeforeEarlierThanAfterError?: boolean;
  filter: AdvertisementFilter
  gridItems: GridItem[] = []

  constructor(
    private advertisementService: AdvertisementService,
    private multilingualTextService: MultilingualTextService,
    private translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private notificationService: NotificationService
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
    const includeOffers = (this.filter.type?.indexOf(AdvertisementType.OFFER) ?? -1) >= 0
    const includeRequests = (this.filter.type?.indexOf(AdvertisementType.REQUEST) ?? -1) >= 0
    return this.fb.group({
      [this.textKey]: this.filter.text?.text,
      [this.includeOffersKey]: includeOffers,
      [this.includeRequestsKey]: includeRequests,
      [this.publishedAfterKey]: this.filter.publishedAfter,
      [this.publishedBeforeKey]: this.filter.publishedBefore,
    }, {
      validators: beforeAfterValidator(
        'publishedAfter', 'publishedBefore', this.publishDateBeforeAfterValidationKey
      )
    })
  }

  private advertisementTypeStringToAdvertisementType(advertisementTypeValue: string) : AdvertisementType | undefined {
    const type : AdvertisementType = advertisementTypeValue as AdvertisementType
    if(!Object.values(AdvertisementType).includes(type)) {
      console.error('Given advertisement type value not found, resorting to not set value!')
      return undefined
    }
    return type
  }

  private advertisementTypeDefined(subject?: AdvertisementType): subject is AdvertisementType  {
    return Object.values(AdvertisementType).includes(subject as AdvertisementType)
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
    this.refreshItems()
  }

  private refreshItems() {
    this.notificationService.startLoading("NOTIFICATIONS.LOADING", true, LoadingType.LOADING)
    this.advertisementService.getPageByFilterAndCurrentProject$(this.filter, this.currentPageRequest)
      .pipe(
        catchError(err => universalHttpErrorResponseHandler(err, this.router)),
        first()
      )
      .subscribe(page => {
        this.gridItems = page ? page.items.map(advert => this.advertisementToGridItem(advert)) : []
        this.notificationService.stopLoading()
      })
  }

  private advertisementTypeButtonText(advertisementType: AdvertisementType) : Observable<string> {
    const translationKeyPostfix = advertisementType === AdvertisementType.OFFER ? 'OFFER' : 'REQUEST'
    return this.translateService.stream(`HELP_LIST.BUTTONS_TEXT.${translationKeyPostfix}`)
  }

  private advertisementToGridItem(advertisement: AdvertisementShort) : GridItem {
    let buttonLink = ""
    this.advertisementService.getAdvertisementDetailsLinkForCurrentProject$(advertisement.id)
      .pipe(first())
      .subscribe(link => buttonLink = link)
    return {
      title: this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(advertisement.title),
      text: this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(advertisement.description),
      buttonsData: [{
        text: this.advertisementTypeButtonText(advertisement.type),
        link: new Link(buttonLink),
      }],
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

  private checkboxesToFilterAdvertisementTypes(includeOffersCheckbox: AbstractControl | null,
                                              includeRequestsCheckbox: AbstractControl | null) : AdvertisementType[]{
    return (includeOffersCheckbox?.value ? [AdvertisementType.OFFER] : [])
      .concat(includeRequestsCheckbox?.value ? [AdvertisementType.REQUEST] : [])
  }

  onSubmit(form: FormGroup) {
    const text : string = form.get(this.textKey)?.value;
    const newFilter: AdvertisementFilter = {
      text: text ? {text: text, lang: this.translateService.currentLang} : undefined,
      type: this.checkboxesToFilterAdvertisementTypes(form.get(this.includeOffersKey), form.get(this.includeRequestsKey)),
      publishedAfter: form.get(this.publishedAfterKey)?.value,
      publishedBefore: form.get(this.publishedBeforeKey)?.value
    }
    console.dir(newFilter)
    this.updateFilter(newFilter)
    this.refreshItems();
  }

  public get isFilterFormValid() : boolean {
    return !this.filterForm.errors
  }
}
