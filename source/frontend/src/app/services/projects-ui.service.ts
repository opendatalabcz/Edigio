import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject, filter, map, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ProjectsUiService {
  private static readonly PROJECTS_MAIN_PAGE_COMMON = 'details'

  private _currentProjectSlug$: BehaviorSubject<string | null | undefined>
    = new BehaviorSubject<string | null | undefined>(null)

  public set currentProjectSlug(value: string | null | undefined) {
    console.log('Setting slug: ', value)
    this._currentProjectSlug$.next(value);
  }

  constructor() {}

  public get currentProjectSlug$(): Observable<string | null | undefined> {
    return this._currentProjectSlug$
  }

  public getProjectSlugFromRoute(route: ActivatedRoute): string | undefined {
    return route.snapshot.params['projectSlug']
  }

  public projectMainPageLinkFromProjectSlug(slug?: string) {
    return "/" + this.urlPrefixFromProjectSlug(slug)
      + ProjectsUiService.PROJECTS_MAIN_PAGE_COMMON
  }

  public urlPrefixFromProjectSlug(slug?: string | null) {
    return slug ? `/project/${slug}/` : '';
  }

  public routeRelativeToCurrentProject$(path: string) : Observable<string>{
    return this.currentProjectSlug$.pipe(map(slug => this.urlPrefixFromProjectSlug(slug) + path))
  }
}
