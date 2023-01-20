import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {GridItem} from "../../models/preview-grid/grid-item";
import {Project} from "../../models/projects/project";
import {distinctUntilChanged, first, map, Observable, Subject, takeUntil} from "rxjs";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {ProjectFilter} from "../../models/projects/project-filter";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
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

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends AutounsubscribingTranslatingComponent implements OnInit {
  private readonly breakpoint$: Observable<BreakpointState>
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
  fields: FormlyFieldConfig[] = []
  options: FormlyFormOptions;

  constructor(private projectsService: ProjectService,
              private projectsUiService: ProjectsUiService,
              private breakpointObserver: BreakpointObserver,
              private filterFormService: FilterFormService,
              private localizationService: LocalizationService,
              translationService: TranslateService,) {
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

    //Defaults for form
    this.form = new FormGroup({})
    this.filters = {catastropheTypes: []}
    this.options = {};
  }

  private getCatastropheLabelTranslation(catastropheType: CatastropheType): string {
    const catastropheTypeName = CatastropheType[catastropheType]
    return this.translationService.instant(`PROJECTS.FILTER_FORM.CATASTROPHE_TYPE.OPTIONS.${catastropheTypeName}`)
  }

  private createCatastropheTypeSelectOption(catastropheType: CatastropheType): SelectInputOption<CatastropheType> {
    return {value: catastropheType, label: this.getCatastropheLabelTranslation(catastropheType)}
  }

  private updateCatastropheTypesOptions(optionsList: SelectInputOption<CatastropheType>[]) {
    console.log("Updating")
    optionsList.forEach(option => option.label = this.getCatastropheLabelTranslation(option.value))
    console.dir(optionsList)
    this.options$.next(optionsList)
  }

  private createCatastropheTypesSelect() {
    const optionsList = [
      this.createCatastropheTypeSelectOption(CatastropheType.WAR),
      this.createCatastropheTypeSelectOption(CatastropheType.FLOODING),
      this.createCatastropheTypeSelectOption(CatastropheType.FIRE),
      this.createCatastropheTypeSelectOption(CatastropheType.HURRICANE),
      this.createCatastropheTypeSelectOption(CatastropheType.OTHER),
    ]
    this.updateCatastropheTypesOptions( optionsList )
    this.onLangChangeEvent$.subscribe(() => { this.updateCatastropheTypesOptions(optionsList) })
    console.log("Creating select")
    return this.filterFormService.createSelectInput({
      key: 'catastropheTypes',
      label: this.getTranslationStream("PROJECTS.FILTER_FORM.CATASTROPHE_TYPE.LABEL"),
      description: this.getTranslationStream("PROJECTS.FILTER_FORM.CATASTROPHE_TYPE.DESCRIPTION"),
      placeholder: this.getTranslationStream("PROJECTS.FILTER_FORM.CATASTROPHE_TYPE.PLACEHOLDER"),
      allowMultipleSelected: true,
      options: this.options$.pipe(untilDestroyed(this))
    })
  }

  ngOnInit() {
    //Prepare form fields
    this.fields = [
      this.filterFormService.createTextInput({
        key: "title",
        label: this.getTranslationStream('PROJECTS.FILTER_FORM.NAME.LABEL'),
        description: this.getTranslationStream('PROJECTS.FILTER_FORM.NAME.DESCRIPTION'),
        placeholder: this.getTranslationStream('PROJECTS.FILTER_FORM.NAME.PLACEHOLDER'),
      }),
      this.filterFormService.createAfterBeforeInput({
        key: "publishedAfter",
        label: this.getTranslationStream('PROJECTS.FILTER_FORM.AFTER.LABEL'),
        description: this.getTranslationStream('PROJECTS.FILTER_FORM.AFTER.DESCRIPTION'),
        placeholder: this.getTranslationStream('PROJECTS.FILTER_FORM.AFTER.PLACEHOLDER'),
      }, {
        key: "publishedBefore",
        label: this.getTranslationStream('PROJECTS.FILTER_FORM.BEFORE.LABEL'),
        description: this.getTranslationStream('PROJECTS.FILTER_FORM.BEFORE.DESCRIPTION'),
        placeholder: this.getTranslationStream('PROJECTS.FILTER_FORM.BEFORE.PLACEHOLDER'),
      }, (model: ProjectFilter) => {
        return {
          before: model.publishedBefore,
          after: model.publishedAfter
        }
      }),
      //Initialization of select options is a bit harder because of labels translation,
      // therefore we give it delegate it to separate method
      this.createCatastropheTypesSelect()
    ]
    this.refreshProjects()
    this.breakpoint$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.onSizeChanges())
  }


  private projectToGridItem(project: Project): GridItem {
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
        link: this.projectsUiService.projectMainPageLinkFromProjectSlug(
          project.slug
        )
      }]
    }
  }

  private onSizeChanges() {
    this.isSmallScreen = this.breakpointObserver
      .isMatched([
        Breakpoints.Small,
        Breakpoints.XSmall
      ])
    this.isSidenavOpened = !this.isSmallScreen
  }

  toggleSidenavOpened(): void {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  private refreshProjects() {
    this.projectsService.getAll(this.nextPageRequest, this.filters)
      .pipe(first())
      .subscribe(projects => {
          this.projects = projects
          this.projectsGridItems = projects.items.map(gridProject => this.projectToGridItem(gridProject))
        }
      )
  }

  onSubmit() {
    this.refreshProjects()
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
