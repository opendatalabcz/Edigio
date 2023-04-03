import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {GridItem} from "../../models/preview-grid/grid-item";
import {ProjectShort} from "../../models/projects/project";
import {combineLatest, distinctUntilChanged, first, forkJoin, map, Observable, pipe, tap} from "rxjs";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {ProjectFilter} from "../../models/projects/project-filter";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CatastropheType} from "../../models/projects/catastrophe-type";
import {TranslateService} from "@ngx-translate/core";
import {MultilingualTextService} from "../../services/multilingual-text.service";
import {SortDirection} from "../../models/common/sort-direction";
import {PageRequest} from "../../models/pagination/page-request";
import {PageEvent} from "@angular/material/paginator";
import {Page} from "../../models/pagination/page";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {beforeAfterValidator} from "../../validators/before-after-validators";
import {LoadingType, NotificationService} from "../../services/notification.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ProjectConverter} from "../../utils/convertors/project-converter";
import {optDateToUrlParam, optUrlParamToDate} from "../../utils/url-params-utils";
import {Link} from "../../models/common/link";
import {isObjectNotNullOrUndefined} from "../../utils/predicates/object-predicates";
import {Nullable} from "../../utils/types/common";
import {LocalizedText} from "../../models/common/multilingual-text";
import {requireDefinedNotNull} from "../../utils/assertions/object-assertions";
import {isArrayEmpty, isArrayNullUndefinedOrEmpty} from "../../utils/array-utils";

interface ProjectsFilterParamsKeys {
  readonly title: string
  readonly publishedAfter: string
  readonly publishedBefore: string
  readonly beforeEarlierThanAfter: string
  readonly catastropheTypes: string;
}

@UntilDestroy()
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  readonly paramsKeys: ProjectsFilterParamsKeys = {
    title: 'title',
    publishedAfter: 'publishedAfter',
    publishedBefore: 'publishedBefore',
    beforeEarlierThanAfter: 'beforeAfter',
    catastropheTypes: 'catastropheTypes',
  }

  readonly urlPageParamsKeys = {
    idx: 'pageIdx',
    size: 'pageSize'
  }

  private readonly breakpoint$: Observable<BreakpointState>
  public projectsGridItems: GridItem[] = []
  public projects?: Page<ProjectShort>

  nextPageRequest: PageRequest = {
    idx: 0,
    size: 8
  }


  _form?: FormGroup
  get form(): FormGroup {
    return requireDefinedNotNull(this._form)
  }
  set form(form: FormGroup) {
    this._form = form
  }
  filters: ProjectFilter = {}

  constructor(private projectService: ProjectService,
              private breakpointObserver: BreakpointObserver,
              private multilingualTextService: MultilingualTextService,
              private translationService: TranslateService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private projectConverter: ProjectConverter) {
    this.breakpoint$ = this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall]
      )
      .pipe(
        distinctUntilChanged(),
        untilDestroyed(this)
      )
  }

  private createEmptyFilterForm(): FormGroup {
    return this.fb.group({
      [this.paramsKeys.title]: this.filters.title?.text ?? null,
      [this.paramsKeys.publishedBefore]: null,
      [this.paramsKeys.publishedAfter]: null,
      [this.paramsKeys.catastropheTypes]: null
    }, {
      validators: beforeAfterValidator(
        this.paramsKeys.publishedAfter, this.paramsKeys.publishedBefore, this.paramsKeys.beforeEarlierThanAfter
      )
    })
  }

  private titleFromRouteQueryParamMap(paramMap: ParamMap): Nullable<LocalizedText> {
    const possiblyTitle = paramMap.get(this.paramsKeys.title)
    if (isObjectNotNullOrUndefined(possiblyTitle)) {
      return this.multilingualTextService.createLocalizedTextForCurrentLang(possiblyTitle)
    }
    return null;
  }

  private catastropheTypesFromQueryParamMap(paramMap: ParamMap): Nullable<CatastropheType[]> {
    const catastrophesStrings = paramMap.getAll(this.paramsKeys.catastropheTypes)
    return isArrayNullUndefinedOrEmpty(catastrophesStrings)
      ? null : catastrophesStrings.map(this.projectConverter.catastropheTypeStringToCatastropheType)
  }

  private pageFromCurrentUrl$(): Observable<PageRequest> {
    return this.activatedRoute.queryParamMap
      .pipe(map((paramMap) => <PageRequest>{
        idx: +(paramMap.get(this.urlPageParamsKeys.idx) ?? 0),
        size: +(paramMap.get(this.urlPageParamsKeys.size) ?? 8),
      }));
  }

  private filterFromCurrentUrl$(): Observable<ProjectFilter> {
    //Angular automatically sanitizes value in input fields
    //Filters sent to server should be sanitized on server side
    // => there's probably no need to sanitize input manually
    return this.activatedRoute.queryParamMap
      .pipe(map((paramMap) => <ProjectFilter>{
        title: this.titleFromRouteQueryParamMap(paramMap),
        publishedAfter: optUrlParamToDate(paramMap.get(this.paramsKeys.publishedAfter)),
        publishedBefore: optUrlParamToDate(paramMap.get(this.paramsKeys.publishedBefore)),
        catastropheTypes: this.catastropheTypesFromQueryParamMap(paramMap)
      }))
  }

  getCatastropheLabelTranslationKey(catastropheType: CatastropheType): string {
    return `PROJECTS.FILTER_FORM.CATASTROPHE_TYPE.OPTIONS.${catastropheType.toUpperCase()}`
  }

  get catastrophesTypes(): CatastropheType[] {
    return [
      CatastropheType.WAR,
      CatastropheType.FLOODING,
      CatastropheType.FIRE,
      CatastropheType.HURRICANE,
      CatastropheType.OTHER
    ]
  }

  ngOnInit() {
    this.filters = {catastropheTypes: []}
    //Try to retrieve filter from url (use case is for sent links, "go back" browser buttons etc.)
    this.form = this.createEmptyFilterForm()
    combineLatest([this.filterFromCurrentUrl$(), this.pageFromCurrentUrl$()])
      .pipe(
        tap(([filters, pageRequest]) => {
          //Normally I would do this in subscribe, but refreshProjects make another subscription,
          //So I'm probably better off do it here (subscribe in subscribe is generally bad)
          this.filters = filters
          this.nextPageRequest = pageRequest
          this.form.setValue({
            title: this.filters.title,
            publishedAfter: this.filters.publishedAfter ?? null,
            publishedBefore: this.filters.publishedBefore ?? null,
            catastropheTypes: this.filters.catastropheTypes ?? null
          })
          this.refreshProjects()
        }),
        first()
      )
      .subscribe()
  }


  private projectToGridItem(project: ProjectShort): GridItem {
    const projectHomepage = this.projectService.projectMainPageLinkFromProjectSlug(
      project.slug
    )
    //Thought about pulling this out to converter, but this format is pretty specific for this page
    //When another use case for this format is found, it probably should be pulled to the converter
    return {
      title: this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(project.title),
      text: this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(project.description),
      buttonsData: [{
        text: this.translationService.stream("PROJECTS.PROJECT_TILE.TO_PROJECT"),
        link: new Link(projectHomepage, false),
      }],
      shareButtonsLink: window.location.origin + projectHomepage
    }
  }

  private refreshProjects() {
    this.notificationService.startLoading("NOTIFICATIONS.LOADING", true, LoadingType.LOADING)
    this.projectService.getPage$(this.nextPageRequest, this.filters)
      .pipe(first())
      .subscribe(projects => {
          this.projects = projects
          this.projectsGridItems = projects.items.map(gridProject => this.projectToGridItem(gridProject))
          this.notificationService.stopLoading()
        }
      )
  }

  get showBeforeEarlierThanAfterError() {
    return this.form.hasError(this.paramsKeys.beforeEarlierThanAfter)
  }

  get isFilterFormValid() {
    return this.form.errors === null
  }

  private filterToUrlQueryParamObject(filter: ProjectFilter) {
    return {
      [this.paramsKeys.title]: filter.title,
      [this.paramsKeys.publishedAfter]: optDateToUrlParam(filter.publishedAfter),
      [this.paramsKeys.publishedBefore]: optDateToUrlParam(filter.publishedBefore),
      [this.paramsKeys.catastropheTypes]: filter.catastropheTypes
    }
  }

  private pageRequestToUrlQueryParamObject(pageRequest: PageRequest) {
    return {
      [this.urlPageParamsKeys.idx]: pageRequest.idx,
      [this.urlPageParamsKeys.size]: pageRequest.size
    }
  }

  private updateQueryParams() {
    this.router.navigate([], {
      queryParams: {
        ...this.filterToUrlQueryParamObject(this.filters),
        ...this.pageRequestToUrlQueryParamObject(this.nextPageRequest)
      }
    })
  }

  onSubmit(data: FormGroup) {
    if (this.isFilterFormValid) {
      const catastrophesType = data.get(this.paramsKeys.catastropheTypes)?.value
      //Retrieve filters from form
      const newFilters = {
        title: data.get(this.paramsKeys.title)?.value,
        publishedBefore: data.get(this.paramsKeys.publishedBefore)?.value,
        publishedAfter: data.get(this.paramsKeys.publishedAfter)?.value,
        catastropheTypes: isArrayNullUndefinedOrEmpty(catastrophesType) ? null : catastrophesType
      }
      //Push filters to history, and setup displayed projects according to filter
      if (newFilters != this.filters) {
        this.filters = newFilters
        //Push filter to url
        this.updateQueryParams()
        this.refreshProjects()
      }
    } else {
      this.notificationService.failure("FORMS.ERRORS.SUBMIT_FAILED", true)
    }
  }

  onPageChanged(pageEvent: PageEvent) {
    this.nextPageRequest = {
      ...this.nextPageRequest,
      idx: pageEvent.pageIndex,
      size: pageEvent.pageSize,
    }
    this.updateQueryParams()
    this.refreshProjects()
  }
}
