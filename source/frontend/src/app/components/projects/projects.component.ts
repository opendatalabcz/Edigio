import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {GridItem} from "../../models/preview-grid/grid-item";
import {ProjectShort} from "../../models/projects/project";
import {distinctUntilChanged, first, map, Observable} from "rxjs";
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
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectConverter} from "../../utils/convertors/project-converter";
import {optDateToUrlParam, optUrlParamToDate} from "../../utils/url-params-utils";
import {Link} from "../../models/common/link";

@UntilDestroy()
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private readonly breakpoint$: Observable<BreakpointState>
  private readonly beforeAfterValidationKey: string = 'beforeAfter'
  public projectsGridItems: GridItem[] = []
  public projects?: Page<ProjectShort>

  nextPageRequest: PageRequest = {
    num: 1,
    size: 8,
    sortDirection: SortDirection.ASCENDING
  }


  form: FormGroup
  filters: ProjectFilter

  constructor(private projectService: ProjectService,
              private breakpointObserver: BreakpointObserver,
              private localizationService: MultilingualTextService,
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
    this.filters = {catastropheTypes: []}
    //Try to retrieve filter from url (use case is for sent links, "go back" browser buttons etc.)
    this.filterFromCurrentUrl$()
      .pipe(first())
      .subscribe(filters => this.filters = filters)
    this.form = this.createFilterForm()
  }

  private createFilterForm(): FormGroup {
    return this.fb.group({
      title: this.filters.title,
      before: this.filters.publishedBefore,
      after: this.filters.publishedAfter,
      catastrophesTypes: [this.filters.catastropheTypes]
    }, {
      validators: beforeAfterValidator('after', 'before', this.beforeAfterValidationKey)
    })
  }

  private filterFromCurrentUrl$(): Observable<ProjectFilter> {
    //Angular automatically sanitizes value in input fields
    //Filters sent to server should be sanitized on server side
    // => there's probably no need to sanitize input manually
    return this.activatedRoute.queryParamMap
      .pipe(map((paramMap) => <ProjectFilter>{
        title: paramMap.get('title'),
        publishedAfter: optUrlParamToDate(paramMap.get('publishedAfter')),
        publishedBefore: optUrlParamToDate(paramMap.get('publishedBefore')),
        catastropheTypes: paramMap.getAll('catastropheTypes')
          .map(this.projectConverter.catastropheTypeStringToCatastropheType)
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
    this.refreshProjects()
    console.log("Initializing projects page")
  }


  private projectToGridItem(project: ProjectShort): GridItem {
    const projectHomepage = this.projectService.projectMainPageLinkFromProjectSlug(
      project.slug
    )
    //Thought about pulling this out to converter, but this format is pretty specific for this page
    //When another use case for this format is found, it probably should be pulled to the converter
    return {
      title: this.localizationService.toLocalizedTextValueForCurrentLanguage$(project.title),
      text: this.localizationService.toLocalizedTextValueForCurrentLanguage$(project.description),
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
    return this.form.hasError(this.beforeAfterValidationKey)
  }

  get isFilterFormValid() {
    return this.form.errors === null
  }

  private filterToUrlQueryParamObject(filter: ProjectFilter) {
    return {
      title: filter.title,
      publishedAfter: optDateToUrlParam(filter.publishedAfter),
      publishedBefore: optDateToUrlParam(filter.publishedBefore),
      catastropheTypes: filter.catastropheTypes
    }
  }

  private updateQueryParams() {
    this.router.navigate([], {
      queryParams: {
        ...this.filterToUrlQueryParamObject(this.filters),
        ...this.nextPageRequest
      }
    })
  }

  onSubmit(data: FormGroup) {
    if (this.isFilterFormValid) {
      //Retrieve filters from form
      const newFilters = {
        title: data.get('title')?.value,
        publishedBefore: data.get('before')?.value,
        publishedAfter: data.get('after')?.value,
        catastropheTypes: data.get('catastrophesTypes')?.value ?? []
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
      num: pageEvent.pageIndex + 1,
      size: pageEvent.pageSize,
    }
    this.updateQueryParams()
    this.refreshProjects()
  }
}
