import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {GridItem} from "../../models/preview-grid/grid-item";
import {Project} from "../../models/projects/project";
import {distinctUntilChanged, Observable, Subject, Subscription} from "rxjs";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {ProjectFilter} from "../../models/projects/project-filter";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {CatastropheType} from "../../models/projects/catastrophe-type";
import {FilterFormService} from "../../services/filter-form.service";
import {TranslateService} from "@ngx-translate/core";
import {SelectInputOption} from "../../services/formly-forms.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private readonly breakpoint$: Observable<BreakpointState>
  public projects: GridItem[] = []
  public isSmallScreen: boolean = false

  private toProjectTextTranslationSubscription?: Subscription
  private toProjectTextObservable: Subject<string | undefined> = new Subject<string | undefined>()
  private toProjectText : string = ""

  private catastropheTypesSubscriptions: Subscription[] = []

  /**
   * Indicator whether sidenav with filter is opened
   */
  isSidenavOpened: boolean = false;

  form: FormGroup
  filters: ProjectFilter
  fields: FormlyFieldConfig[]
  options: FormlyFormOptions;

  constructor(private projectsService: ProjectService,
              private projectsUiService: ProjectsUiService,
              private breakpointObserver: BreakpointObserver,
              private filterFormService: FilterFormService,
              private translationService: TranslateService) {
    this.breakpoint$ = this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall ]
      )
      .pipe(distinctUntilChanged())

    //Defaults for form
    this.form = new FormGroup({})
    this.filters = {catastropheTypes: []}
    this.options = {};

    //Prepare form fields
    this.fields = [
      this.filterFormService.createTextInput({
          key: "title",
          label: this.translationService.stream('PROJECTS.FILTER_FORM.NAME.LABEL'),
          description: this.translationService.stream('PROJECTS.FILTER_FORM.NAME.DESCRIPTION'),
          placeholder: this.translationService.stream('PROJECTS.FILTER_FORM.NAME.PLACEHOLDER')
      }),
      this.filterFormService.createAfterBeforeInput({
        key: "publishedAfter",
        label: this.translationService.stream('PROJECTS.FILTER_FORM.AFTER.LABEL'),
        description: this.translationService.stream('PROJECTS.FILTER_FORM.AFTER.DESCRIPTION'),
        placeholder: this.translationService.stream('PROJECTS.FILTER_FORM.AFTER.PLACEHOLDER'),
      },{
        key: "publishedBefore",
        label: this.translationService.stream('PROJECTS.FILTER_FORM.BEFORE.LABEL'),
        description: this.translationService.stream('PROJECTS.FILTER_FORM.BEFORE.DESCRIPTION'),
        placeholder: this.translationService.stream('PROJECTS.FILTER_FORM.BEFORE.PLACEHOLDER'),
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
  }

  private getCatastropheLabelTranslation(catastropheType: CatastropheType) : string {
    const catastropheTypeName = CatastropheType[catastropheType]
    return this.translationService.instant(`PROJECTS.FILTER_FORM.CATASTROPHE_TYPE.OPTIONS.${catastropheTypeName}`)
  }

  private createCatastropheTypeSelectOption(catastropheType: CatastropheType) : SelectInputOption{
    return {value: catastropheType, label: this.getCatastropheLabelTranslation(catastropheType)}
  }

  private createCatastropheTypesSelect() {
    const optionsList = [
      this.createCatastropheTypeSelectOption(CatastropheType.WAR),
      this.createCatastropheTypeSelectOption(CatastropheType.FLOODING),
      this.createCatastropheTypeSelectOption(CatastropheType.FIRE),
      this.createCatastropheTypeSelectOption(CatastropheType.HURRICANE),
      this.createCatastropheTypeSelectOption(CatastropheType.OTHER),
    ]
    //
    const options$ : Subject<SelectInputOption[]> = new Subject();
    this.translationService.onLangChange.subscribe(() => {
      optionsList.forEach(option => option.label = this.getCatastropheLabelTranslation(option.value))
      options$.next(optionsList)
    })
    return this.filterFormService.createSelectInput({
      key: 'catastropheTypes',
      label: this.translationService.stream("PROJECTS.FILTER_FORM.CATASTROPHE_TYPE.LABEL"),
      description: this.translationService.stream("PROJECTS.FILTER_FORM.CATASTROPHE_TYPE.DESCRIPTION"),
      placeholder: this.translationService.stream("PROJECTS.FILTER_FORM.CATASTROPHE_TYPE.PLACEHOLDER"),
      allowMultipleSelected: true,
      options: options$
    })
  }

  ngOnInit() {
    this.projects = this.projectsService.getAll()
      .map((project) => this.projectToGridItem(project))
    this.breakpoint$
      .subscribe(() => this.onSizeChanges())
    this.toProjectTextTranslationSubscription = this.translationService
      .stream("PROJECTS.PROJECT_TILE.TO_PROJECT")
      .subscribe(translation => {
        this.toProjectText = translation
        this.toProjectTextObservable.next(translation)
      })
  }

  ngOnDestroy(): void {
    this.toProjectTextTranslationSubscription?.unsubscribe()
    this.catastropheTypesSubscriptions.forEach(sub => sub.unsubscribe())
  }



  private projectToGridItem(project: Project) : GridItem {
    const item = {
      title: project.title,
      text: project.description,
      buttonsData: [{
        text: this.toProjectText,
        link: this.projectsUiService.projectMainPageLinkFromProjectSlug(
          project.slug
        )
      }]
    }
    this.toProjectTextObservable
      .subscribe((text) => item.buttonsData[0].text = text ?? "")
    return item
  }

  private onSizeChanges() {
    this.isSmallScreen = this.breakpointObserver.isMatched([
      Breakpoints.Small,
      Breakpoints.XSmall
    ])
    this.isSidenavOpened = !this.isSmallScreen
  }

  toggleSidenavOpened() : void {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  onSubmit(filters: ProjectFilter) {
    this.projects = this.projectsService.getAll(filters)
      .map(project => this.projectToGridItem(project))
  }
}
