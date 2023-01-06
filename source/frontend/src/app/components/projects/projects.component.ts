import {Component, Input, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {GridItem} from "../../models/preview-grid/grid-item";
import {Project} from "../../models/projects/project";
import {distinctUntilChanged, Observable} from "rxjs";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from "@angular/cdk/layout";
import {ProjectFilter} from "../../models/projects/project-filter";
import {FormlyFormsService} from "../../services/formly-forms.service";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {CatastropheType} from "../../models/projects/catastrophe-type";
import {FilterFormService} from "../../services/filter-form.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private readonly breakpoint$: Observable<BreakpointState>
  public projects: GridItem[] = []
  public isSmallScreen: boolean = false

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
              private filterFormService: FilterFormService) {
    this.breakpoint$ = this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall ]
      )
      .pipe(distinctUntilChanged())
    this.form = new FormGroup({})
    this.filters = {catastropheTypes: []}
    this.options = {};
    this.fields = [
      this.filterFormService.createTextInput({
          key: "title",
          label: "Jmeno",
          description: "Jmeno projektu",
          placeholder: "Jmeno projektu"
      }),
      this.filterFormService.createAfterBeforeInput({
        key: "publishedAfter",
        label: "Od",
        description: "Nejdrivejsi datum vzniku projektu",
        placeholder: "Nejdrivejsi datum vzniku projektu",
      },{
        key: "publishedBefore",
        label: "Do",
        description: "Nejpozdejsi datum vzniku projektu",
        placeholder: "Nejpozdejsi datum vzniku projektu"
      }, (model: ProjectFilter) => {
        return {
          before: model.publishedBefore,
          after: model.publishedAfter
        }
      }),
      this.filterFormService.createSelectInput({
        key: 'catastropheTypes',
        label: 'Typ katastrofy',
        description: 'Povolené typy katastrofy',
        placeholder: 'Povolené typy katastrofy',
        allowMultipleSelected: true,
        options: [
          {value: CatastropheType.WAR, label: 'Válka'},
          {value: CatastropheType.FLOODING, label: 'Povodeň'},
          {value: CatastropheType.FIRE, label: 'Oheň'},
          {value: CatastropheType.HURRICANE, label: 'Hurikán'},
          {value: CatastropheType.OTHER, label: 'Ostatní'},
        ]
      })
    ]
  }

  ngOnInit() {
    this.projects = this.projectsService.getAll()
      .map((project) => this.projectToGridItem(project))
    this.breakpoint$
      .subscribe(() => this.onSizeChanges())
  }

  private projectToGridItem(project: Project) : GridItem {
    return {
      title: project.title,
      text: project.description,
      buttonsData: [{
        text: "To project",
        link: this.projectsUiService.projectMainPageLinkFromProjectSlug(
          project.slug
        )
      }]
    }
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
