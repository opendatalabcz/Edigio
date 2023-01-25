import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject, filter, map, Observable} from "rxjs";
import {ProjectService} from "./project.service";
import {UntilDestroy} from "@ngneat/until-destroy";


@Injectable({
  providedIn: 'root'
})
export class ProjectsUiService {
  private static readonly PROJECTS_MAIN_PAGE_COMMON = 'details'

  private _currentProjectSlug$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined)

  private set currentProjectSlug(value: string | undefined) {
    console.log('Setting slug: ', value)
    this._currentProjectSlug$.next(value);
  }

  constructor(private router: Router,
              private projectService: ProjectService) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.routerState.root),
        map(route => {
          while (route.firstChild)
            route = route.firstChild
          return route
        }),
        map(route => this.getProjectSlugFromRoute(route))
      ).subscribe(slug => this._currentProjectSlug$.next(slug))
  }

  public getCurrentProjectSlug$(): Observable<string | undefined> {
    return this._currentProjectSlug$
  }

  public getProjectSlugFromRoute(route: ActivatedRoute): string | undefined {
    return route.snapshot.params['projectSlug']
  }

  public projectMainPageLinkFromProjectSlug(slug?: string) {
    return "/" + this.urlPrefixFromProjectSlug(slug)
      + ProjectsUiService.PROJECTS_MAIN_PAGE_COMMON
  }

  public urlPrefixFromProjectSlug(slug?: string) {
    return slug ? `/project/${slug}/` : '';
  }
}
