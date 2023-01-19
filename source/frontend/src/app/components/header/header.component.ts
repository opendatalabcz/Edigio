import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectShort} from "../../models/projects/project";
import {mergeMap, Observable, of, Subscription} from "rxjs";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {ProjectService} from "../../services/project.service";
import {TranslateService} from "@ngx-translate/core";
import {LocalizationService} from "../../services/localization.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private projectSubscripton?: Subscription

  constructor(private projectsUiService: ProjectsUiService,
              private projectService: ProjectService,
              private translateService: TranslateService,
              public localizationService: LocalizationService) {
  }

  public project?: ProjectShort
  public translatedProjectTitle$?: Observable<string>
  public projectPrefix?: string
  public projectHomepage?: string
  public languages: string[] = []
  isNavbarCollapsed: boolean = true;

  ngOnInit() {
    this.projectSubscripton =
      this.projectsUiService.getCurrentProjectSlug$()
        .pipe(
          mergeMap((slug) => slug ? this.projectService.getShortBySlug(slug) : of(undefined)),
        )
        .subscribe((project?: ProjectShort) => {
          console.log("called")
          this.project = project;
          this.projectPrefix = this.projectsUiService.urlPrefixFromProjectSlug(this.project?.slug)
          this.projectHomepage = this.projectsUiService.projectMainPageLinkFromProjectSlug(this.project?.slug)
          this.translatedProjectTitle$ =
            this.project ? this.localizationService.toLocalizedTextValueForCurrentLanguage$(this.project.title) : undefined
        });
    this.languages = this.translateService.getLangs()
  }

  ngOnDestroy() {
    this.projectSubscripton?.unsubscribe();
  }

  changeLanguage(lang: string) {
    this.translateService.use(lang)
  }

  get currentLanguage(): string {
    return this.translateService.currentLang
  }

  getNavLink(relativePath: string) : string {
    return this.projectPrefix + relativePath
  }
}
