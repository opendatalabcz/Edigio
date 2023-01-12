import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map, Observable} from "rxjs";
import {ProjectService} from "./project.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectsUiService {
  private static readonly PROJECTS_MAIN_PAGE_COMMON = 'details'

  constructor(private router: Router,
              private projectService: ProjectService) {
  }

  public getCurrentProjectSlug$(): Observable<string | undefined> {
    return this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.routerState.root),
        map(route => {
          while (route.firstChild)
            route = route.firstChild
          return route
        }),
        map(route => {
          const slug = this.getProjectSlugFromRoute(route)
          console.log(slug)
          return slug
        })
      )
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
