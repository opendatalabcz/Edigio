import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project, ProjectShort} from "../../models/projects/project";
import {Subscription} from "rxjs";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {ProjectService} from "../../services/project.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private projectSubscripton?: Subscription
  constructor(private projectsUiService: ProjectsUiService,
              private projectService: ProjectService,
              private translateService: TranslateService) {}
  public project?: ProjectShort;
  public projectPrefix?: string
  public projectHomepage?: string
  public languages: string[] = []
  isNavbarCollapsed: boolean = true;

  ngOnInit() {
    this.projectSubscripton = this.projectsUiService.getCurrentProjectSlug$()
      .subscribe(slug => {
        this.project = slug ? this.projectService.getShortBySlug(slug) : undefined
        this.projectPrefix = this.projectsUiService.urlPrefixFromProjectSlug(
          this.project?.slug
        )
        this.projectHomepage = this.projectsUiService
          .projectMainPageLinkFromProjectSlug(this.project?.slug)
      });
    this.languages = this.translateService.langs
  }

  ngOnDestroy() {
    this.projectSubscripton?.unsubscribe();
  }

  changeLanguage(lang: string) {
    this.translateService.use(lang)
  }

  get currentLanguage() {
    return this.translateService.currentLang
  }
}
