import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectShort} from "../../models/projects/project";
import {distinctUntilChanged, mergeMap, Observable, of, Subscription} from "rxjs";
import {ProjectService} from "../../services/project.service";
import {MultilingualTextService} from "../../services/multilingual-text.service";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LanguageService} from "../../services/language.service";
import {ReadOnlyLanguage} from "../../models/common/language";

@UntilDestroy()
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

  public isCollapsedVariant = false
  public isCollapsed = true
  public collapsedVariantsBreakpoints: string[] = [
    Breakpoints.XSmall,
    Breakpoints.Small
  ]

  constructor(private projectService: ProjectService,
              private languageService: LanguageService,
              public localizationService: MultilingualTextService,
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
      this.projectService.currentProjectSlug$
        .pipe(
          mergeMap((slug) => slug ? this.projectService.getShortBySlug(slug) : of(undefined)),
          untilDestroyed(this)
        )
        .subscribe((project?: ProjectShort) => {
          this.project = project;
          this.projectPrefix = this.projectService.urlPrefixFromProjectSlug(this.project?.slug)
          this.projectHomepage = this.projectService.projectMainPageLinkFromProjectSlug(this.project?.slug)
          this.translatedProjectTitle$ =
            this.project ? this.localizationService.toLocalizedTextValueForCurrentLanguage$(this.project.title) : undefined
        });
    this.breakpoint$
      .subscribe(() => this.onScreenSizeChanges())
  }

  private onScreenSizeChanges() {
    this.isCollapsedVariant = this.breakpointObserver.isMatched(this.collapsedVariantsBreakpoints)
    //We want menu to be collapsed on initial transition from large screen to medium/small screen
    //When we are just transitioning between small/medium screen, we want it to remain opened/close
    this.isCollapsed = !this.isCollapsedVariant || this.isCollapsed;
  }

  compareLangsByCode(firstLang: ReadOnlyLanguage, secondLang: ReadOnlyLanguage): boolean {
    return firstLang.code.localeCompare(secondLang.code) === 0
  }

  trackByLangCode(_index: number, lang: ReadOnlyLanguage): string {
    return lang.code
  }

  ngOnDestroy() {
    this.projectSubscription?.unsubscribe();
  }

  changeLanguage(language: ReadOnlyLanguage) {
    this.languageService.changeAppLanguageByCode(language.code)
  }

  get currentLanguage$(): Observable<ReadOnlyLanguage> {
    return this.languageService.currentLanguage$
  }

  get isProjectSelected(): boolean {
    return !!this.project
  }

  get availableLanguages(): readonly ReadOnlyLanguage[] {
    return this.languageService.readonlyAvailableLanguages
  }

  getNavLink(relativePath: string): string {
    return this.projectPrefix + relativePath
  }

}
