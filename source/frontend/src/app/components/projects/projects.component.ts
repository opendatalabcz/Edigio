import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {GridItem} from "../../models/preview-grid/grid-item";
import {Project} from "../../models/projects/project";
import {distinctUntilChanged, first, map, Observable} from "rxjs";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {ProjectFilter} from "../../models/projects/project-filter";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CatastropheType} from "../../models/projects/catastrophe-type";
import {TranslateService} from "@ngx-translate/core";
import {MultilingualTextService} from "../../services/multilingual-text.service";
import {SortDirection} from "../../models/common/sort-direction";
import {PageRequest} from "../../models/common/page-request";
import {PageEvent} from "@angular/material/paginator";
import {Page} from "../../models/common/page";
import {
  AutounsubscribingTranslatingComponent
} from "../autounsubscribing-translating/autounsubscribing-translating.component";
import {untilDestroyed} from "@ngneat/until-destroy";
import {beforeAfterValidator} from "../../validators/before-after-validators";
import {LoadingType, NotificationService} from "../../services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {format, parse} from "date-fns";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends AutounsubscribingTranslatingComponent implements OnInit {
  private readonly breakpoint$: Observable<BreakpointState>
  private readonly beforeAfterValidationKey: string = 'beforeAfter'
  public projectsGridItems: GridItem[] = []
  public projects?: Page<Project>

  nextPageRequest: PageRequest = {
    num: 1,
    size: 8,
    sortDirection: SortDirection.ASCENDING
  }


  form: FormGroup
  filters: ProjectFilter

  constructor(private projectsService: ProjectService,
              private projectsUiService: ProjectsUiService,
              private breakpointObserver: BreakpointObserver,
              private localizationService: MultilingualTextService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              translationService: TranslateService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    super(translationService)
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
    this.form = this.fb.group({
      title: this.filters.title,
      before: this.filters.publishedBefore,
      after: this.filters.publishedAfter,
      catastrophesTypes: [this.filters.catastropheTypes]
    }, {
      validators: beforeAfterValidator('after', 'before', this.beforeAfterValidationKey)
    })
  }

  private  catastropheTypeNumberStringToCatastropheType(catastropheTypeString: string) : CatastropheType {
    const catastropheType = catastropheTypeString as CatastropheType
    if(!Object.values(CatastropheType).includes(catastropheType)) {
      throw new Error('Given catastrophe type string is not valid catastrophe type! ' + catastropheTypeString)
    }
    return catastropheType
  }

  private filterFromCurrentUrl$() : Observable<ProjectFilter> {
    //Angular automatically sanitizes value in input fields
    //Filters sent to server should be sanitized on server side
    // => there's probably no need to sanitize input manually
    return this.activatedRoute.queryParamMap
      .pipe(map((paramMap) => <ProjectFilter>{
        title: paramMap.get('title'),
        publishedAfter: this.urlParamToDate(paramMap.get('publishedAfter')),
        publishedBefore: this.urlParamToDate(paramMap.get('publishedBefore')),
        catastropheTypes: paramMap.getAll('catastropheTypes')
          .map(this.catastropheTypeNumberStringToCatastropheType)
      }))
  }

  private urlParamToDate(param?: string | null) : Date | undefined {
    return param ? parse(param, 'ddMMyyyy', new Date()) : undefined
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


  private projectToGridItem(project: Project): GridItem {
    const projectHomepage = this.projectsUiService.projectMainPageLinkFromProjectSlug(
      project.slug
    )
    //Thought about pulling this out to converter, but this format is pretty specific for this page
    //When another use case for this format is found, it probably should be pulled to the converter
    return {
      //No need to unsubscribe as we didn't subscribed yet,
      // subscription will be dealt with in preview grid
      title: this.localizationService.toLocalizedTextValueForCurrentLanguage$(project.title),
      text: this.localizationService.toLocalizedTextValueForCurrentLanguage$(project.description),
      buttonsData: [{
        text: this.getTranslationStream("PROJECTS.PROJECT_TILE.TO_PROJECT"),
        link: projectHomepage,
        isAbsolute: false
      }],
      shareButtonsLink: window.location.origin + projectHomepage
    }
  }

  private refreshProjects() {
    this.notificationService.startLoading("NOTIFICATIONS.LOADING", true, LoadingType.LOADING)
    this.projectsService.getAll(this.nextPageRequest, this.filters)
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

  private dateToUrlParam(date?: Date) : string | undefined {
    return date ? format(date, "ddMMyyyy") : undefined
  }

  private filterToUrlQueryParamObject(filter: ProjectFilter) {
    return {
      title: filter.title,
      publishedAfter: this.dateToUrlParam(filter.publishedAfter),
      publishedBefore: this.dateToUrlParam(filter.publishedBefore),
      catastropheTypes: filter.catastropheTypes
    }
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
      if(newFilters != this.filters) {
        //Push filter to url
        this.router.navigate([], { queryParams: this.filterToUrlQueryParamObject(newFilters) })
        this.filters = newFilters
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
    this.refreshProjects()
  }
}
