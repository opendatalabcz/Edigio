import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectShort} from "../../models/projects/project";
import {distinctUntilChanged, mergeMap, Observable, of, Subscription} from "rxjs";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {ProjectService} from "../../services/project.service";
import {TranslateService} from "@ngx-translate/core";
import {LocalizationService} from "../../services/localization.service";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private projectSubscription?: Subscription
  private breakpoint$: Observable<BreakpointState>
  public project?: ProjectShort
  public translatedProjectTitle$?: Observable<string>
  public projectPrefix?: string
  public projectHomepage?: string
  public languages: string[] = []

  public isCollapsedVariant= false
  public isCollapsed = true
  public collapsedVariantsBreakpoints: string[] = [
    Breakpoints.XSmall,
    Breakpoints.Small
  ]

  constructor(private projectsUiService: ProjectsUiService,
              private projectService: ProjectService,
              private translateService: TranslateService,
              public localizationService: LocalizationService,
              public breakpointObserver: BreakpointObserver) {
    this.breakpoint$ = this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall,
      ])
      .pipe(distinctUntilChanged())
    this.onScreenSizeChanges()
  }

  ngOnInit() {
    this.projectSubscription =
      this.projectsUiService.currentProjectSlug$
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
    this.breakpoint$
      .subscribe(() => this.onScreenSizeChanges())
    this.languages = this.translateService.getLangs()
  }

  private onScreenSizeChanges() {
    this.isCollapsedVariant = this.breakpointObserver.isMatched(this.collapsedVariantsBreakpoints)
    //We want menu to be collapsed on initial transition from large screen to medium/small screen
    //When we are just transitioning between small/medium screen, we want it to remain opened/close
    this.isCollapsed = !this.isCollapsedVariant || this.isCollapsed;
  }

  ngOnDestroy() {
    this.projectSubscription?.unsubscribe();
  }

  changeLanguage(lang: string) {
    this.translateService.use(lang)
  }

  get currentLanguage(): string {
    return this.translateService.currentLang
  }

  get isProjectSelected(): boolean {
    return !!this.project
  }

  getNavLink(relativePath: string) : string {
    return this.projectPrefix + relativePath
  }

}
