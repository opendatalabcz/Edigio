import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {beforeAfterValidator} from "../../../validators/before-after-validators";
import {AdvertisementFilter} from "../../../models/advertisement/advertisement-filter";
import {AdvertisementShort, AdvertisementType} from "../../../models/advertisement/advertisement";
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
import {LanguageService} from "../../../services/language.service";
import {PageEvent} from "@angular/material/paginator";
import {Page} from "../../../models/pagination/page";
import {AdvertisementHelpType} from "../../../models/advertisement/advertisement-help-type";
import {requireDefinedNotNull} from "../../../utils/assertions/object-assertions";

@Component({
  selector: 'app-help-list',
  templateUrl: './help-list.component.html',
  styleUrls: ['./help-list.component.scss']
})
export class HelpListComponent implements OnInit {
  protected readonly publishDateBeforeAfterValidationKey = 'publishDateBeforeAfterValidationKey'
  protected readonly textKey = 'text'
  protected readonly includeOffersKey = 'includeOffers'
  protected readonly includeRequestsKey = 'includeRequests'
  protected readonly publishedAfterKey = 'publishedAfter'
  protected readonly publishedBeforeKey = 'publishedBefore'
  protected readonly typeKey = 'type'
  protected readonly helpTypeKey = 'helpType'

  currentPageRequest: PageRequest = {idx: 0, size: 8, sortDirection: SortDirection.DESCENDING}
  currentPage?: Page<AdvertisementShort>

  _filterForm?: FormGroup;
  get filterForm(): FormGroup {
    return requireDefinedNotNull(this._filterForm)
  }

  set filterForm(form: FormGroup) {
    this._filterForm = form
  }

  showBeforeEarlierThanAfterError?: boolean;
  filter: AdvertisementFilter = {}
  gridItems: GridItem[] = []

  constructor(
    private advertisementService: AdvertisementService,
    private multilingualTextService: MultilingualTextService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.filterForm = this.createEmptyFilterForm()
    this.activatedRoute
      .queryParamMap
      .pipe(
        map(paramMap => <[AdvertisementFilter, PageRequest]>[
          this.routerQueryParamMapToAdvertisementFilter(paramMap),
          this.routerQueryParamMapToPageRequest(paramMap),
        ]),
        first()
      ).subscribe(([filter, pageRequest]) => {
      const includeOffers = (this.filter.type?.indexOf(AdvertisementType.OFFER) ?? -1) >= 0
      const includeRequests = (this.filter.type?.indexOf(AdvertisementType.REQUEST) ?? -1) >= 0
      this.filter = filter
      this.currentPageRequest = pageRequest
      this.filterForm.setValue({
        [this.textKey]: this.filter.text?.text ?? '',
        [this.includeOffersKey]: includeOffers,
        [this.includeRequestsKey]: includeRequests,
        [this.publishedAfterKey]: this.filter.publishedAfter ?? null,
        [this.publishedBeforeKey]: this.filter.publishedBefore ?? null,
        [this.helpTypeKey]: [this.filter.helpType],
      })
      this.refreshItems()
    })
  }

  private createEmptyFilterForm(): FormGroup {
    console.log(this.filter.helpType)
    return this.fb.group({
      [this.textKey]: '',
      [this.includeOffersKey]: true,
      [this.includeRequestsKey]: true,
      [this.publishedAfterKey]: null,
      [this.publishedBeforeKey]: null,
      [this.helpTypeKey]: [this.filter.helpType],
    }, {
      validators: beforeAfterValidator(
        'publishedAfter', 'publishedBefore', this.publishDateBeforeAfterValidationKey
      )
    })
  }

  private advertisementTypeStringToAdvertisementType(advertisementTypeValue: string): AdvertisementType | undefined {
    const type: AdvertisementType = advertisementTypeValue as AdvertisementType
    if (!Object.values(AdvertisementType).includes(type)) {
      console.error('Given advertisement type value not found, resorting to not set value!')
      return undefined
    }
    return type
  }

  private helpTypeStringToAdvertisementType(advertisementTypeValue: string): AdvertisementHelpType | undefined {
    const type: AdvertisementHelpType = advertisementTypeValue as AdvertisementHelpType
    if (!Object.values(AdvertisementHelpType).includes(type)) {
      console.error('Given advertisement type value not found, resorting to not set value!')
      return undefined
    }
    return type
  }

  private advertisementTypeDefined(subject?: AdvertisementType): subject is AdvertisementType {
    return Object.values(AdvertisementType).includes(subject as AdvertisementType)
  }

  private helpTypeDefined(subject?: AdvertisementHelpType): subject is AdvertisementHelpType {
    return Object.values(AdvertisementHelpType).includes(subject as AdvertisementHelpType)
  }

  private routerQueryParamMapToAdvertisementFilter(queryParamMap: ParamMap): AdvertisementFilter {
    const text = queryParamMap.get(this.textKey)
    const advertisementTypeValues = queryParamMap.getAll(this.typeKey)
    const helpTypeValues = queryParamMap.getAll(this.helpTypeKey)
    return {
      text: text ? {text: text, lang: this.languageService.instantLanguage.code} : undefined,
      type: advertisementTypeValues
        .map(typeValue => this.advertisementTypeStringToAdvertisementType(typeValue))
        .filter(this.advertisementTypeDefined),
      helpType: helpTypeValues
        .map(typeValue => this.helpTypeStringToAdvertisementType(typeValue))
        //Unknown values are returned as undefined in previously used map function,
        // so we need to filter out these values
        .filter(this.helpTypeDefined),
      publishedAfter: optUrlParamToDate(queryParamMap.get(this.publishedAfterKey)),
      publishedBefore: optUrlParamToDate(queryParamMap.get(this.publishedBeforeKey))
    }
  }

  private routerQueryParamMapToPageRequest(queryParamMap: ParamMap): PageRequest {
    return {
      idx: +(queryParamMap.get('pageIdx') ?? 0),
      size: +(queryParamMap.get('pageSize') ?? 0),
    }
  }

  private refreshItems() {
    this.notificationService.startLoading("NOTIFICATIONS.LOADING", true, LoadingType.LOADING)
    this.advertisementService.getPageByFilterAndCurrentProject$(this.filter, this.currentPageRequest)
      .pipe(
        catchError(err => universalHttpErrorResponseHandler(err, this.router)),
        first()
      )
      .subscribe(page => {
        this.currentPage = page
        this.gridItems = page ? page.items.map(advert => this.advertisementToGridItem(advert)) : []
        this.notificationService.stopLoading()
      })
  }

  private advertisementTypeButtonText(advertisementType: AdvertisementType): Observable<string> {
    const translationKeyPostfix = advertisementType === AdvertisementType.OFFER ? 'OFFER' : 'REQUEST'
    return this.translateService.stream(`HELP_LIST.BUTTONS_TEXT.${translationKeyPostfix}`)
  }

  private advertisementToGridItem(advertisement: AdvertisementShort): GridItem {
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
  }

  private updateQueryParams() {
    this.router.navigate([], {
      queryParams: {
        text: this.filter.text?.text,
        type: this.filter.type,
        publishedAfter: optDateToUrlParam(this.filter.publishedAfter),
        publishedBefore: optDateToUrlParam(this.filter.publishedBefore),
        helpType: this.filter.helpType,
        pageSize: this.currentPageRequest?.size,
        pageIdx: this.currentPageRequest?.idx
      }
    })
  }

  private checkboxesToFilterAdvertisementTypes(includeOffersCheckbox: AbstractControl | null,
                                               includeRequestsCheckbox: AbstractControl | null): AdvertisementType[] {
    return (includeOffersCheckbox?.value ? [AdvertisementType.OFFER] : [])
      .concat(includeRequestsCheckbox?.value ? [AdvertisementType.REQUEST] : [])
  }

  onSubmit(form: FormGroup) {
    const text: string = form.get(this.textKey)?.value;
    const newFilter: AdvertisementFilter = {
      text: text ? {text: text, lang: this.languageService.instantLanguage.code} : undefined,
      type: this.checkboxesToFilterAdvertisementTypes(form.get(this.includeOffersKey), form.get(this.includeRequestsKey)),
      helpType: form.get(this.helpTypeKey)?.value,
      publishedAfter: form.get(this.publishedAfterKey)?.value,
      publishedBefore: form.get(this.publishedBeforeKey)?.value
    }
    console.log('new filter:', newFilter)
    this.updateFilter(newFilter)
    this.updateQueryParams()
    this.refreshItems();
  }

  public get isFilterFormValid(): boolean {
    return !this.filterForm.errors
  }


  onPageChanged($event: PageEvent) {
    this.currentPageRequest = {
      idx: $event.pageIndex,
      size: $event.pageSize,
      sortDirection: this.currentPageRequest.sortDirection
    }
    this.updateQueryParams()
    this.refreshItems()
  }
}
