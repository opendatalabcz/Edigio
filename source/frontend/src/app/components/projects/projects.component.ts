import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {GridItem} from "../../models/preview-grid/grid-item";
import {Project} from "../../models/projects/project";
import {distinctUntilChanged, first, map, Observable, Subject} from "rxjs";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {ProjectFilter} from "../../models/projects/project-filter";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CatastropheType} from "../../models/projects/catastrophe-type";
import {FilterFormService} from "../../services/filter-form.service";
import {TranslateService} from "@ngx-translate/core";
import {SelectInputOption} from "../../services/formly-forms.service";
import {LocalizationService} from "../../services/localization.service";
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
import {Router} from "@angular/router";
import {APP_BASE_HREF} from "@angular/common";

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
  public isSmallScreen = false
  options$: Subject<SelectInputOption<CatastropheType>[]> = new Subject();

  nextPageRequest: PageRequest = {
    num: 1,
    size: 8,
    sortDirection: SortDirection.ASCENDING
  }

  /**
   * Indicator whether sidenav with filter is opened
   */
  isSidenavOpened = false;

  form: FormGroup
  filters: ProjectFilter

  constructor(private projectsService: ProjectService,
              private projectsUiService: ProjectsUiService,
              private breakpointObserver: BreakpointObserver,
              private filterFormService: FilterFormService,
              private localizationService: LocalizationService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              translationService: TranslateService,
              private router: Router) {
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
    this.form = this.fb.group({
      title: this.filters.title,
      before: this.filters.publishedBefore,
      after: this.filters.publishedAfter,
      catastrophesTypes: this.filters.catastropheTypes
    }, {
      validators: beforeAfterValidator('after', 'before', this.beforeAfterValidationKey)
    })
  }

  getCatastropheLabelTranslationKey(catastropheType: CatastropheType): string {
    const catastropheTypeName = CatastropheType[catastropheType]
    return `PROJECTS.FILTER_FORM.CATASTROPHE_TYPE.OPTIONS.${catastropheTypeName}`
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
  }


  private projectToGridItem(project: Project): GridItem {
    const projectHomepage = this.projectsUiService.projectMainPageLinkFromProjectSlug(
      project.slug
    )
    return {
      title: this.localizationService.toLocalizedTextForCurrentLanguage$(project.title)
        .pipe(
          map(localizedText => localizedText.text),
          untilDestroyed(this),
        ),
      text: this.localizationService
        .toLocalizedTextForCurrentLanguage$(project.description)
        .pipe(
          map(localizedText => localizedText.text),
          untilDestroyed(this)
        ),
      buttonsData: [{
        text: this.getTranslationStream("PROJECTS.PROJECT_TILE.TO_PROJECT"),
        link: projectHomepage
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
          this.notificationService.stop_loading()
        }
      )
  }

  get showBeforeEarlierThanAfterError() {
    return this.form.hasError(this.beforeAfterValidationKey)
  }

  get isFilterFormValid() {
    return this.form.errors === null
  }

  onSubmit(data: FormGroup) {
    if (this.isFilterFormValid) {
      const newFilters = {
        title: data.get('title')?.value,
        publishedBefore: data.get('before')?.value,
        publishedAfter: data.get('after')?.value,
        catastropheTypes: data.get('catastrophesTypes')?.value ?? []
      }
      if(newFilters != this.filters) {
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
