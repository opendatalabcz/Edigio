import {Injectable} from '@angular/core';
import {Project, ProjectShort} from "../models/projects/project";
import {ProjectFilter} from "../models/projects/project-filter";
import {BehaviorSubject, map, mergeMap, Observable, of, timer} from "rxjs";
import {CatastropheType} from "../models/projects/catastrophe-type";
import {MultilingualText} from "../models/common/multilingual-text";
import {TranslateService} from "@ngx-translate/core";
import {Page} from "../models/pagination/page";
import {PageRequest} from "../models/pagination/page-request";
import {ProjectConverter} from "../utils/convertors/project-converter";
import {mapPageItems, pageFromItems} from "../utils/page-utils";
import {endOfDay, isAfter, isBefore, startOfDay} from "date-fns";
import {ImportantInformation, ProjectDetailsIntroPage} from "../models/projects/projectPages";
import {ActivatedRoute} from "@angular/router";
import {isObjectNotNullOrUndefined, isObjectNullOrUndefined} from "../utils/predicates/object-predicates";
import {isArrayEmpty} from "../utils/array-utils";
import {Nullable} from "../utils/types/common";
import {HttpClient} from "@angular/common/http";
import {
  projectDetailsPageRetrievalApiURl,
  projectExistsApiUrl,
  PROJECTS_API_URL,
  PROJECTS_PAGE_REQUEST_API_URL, projectShortApiUrl
} from "../utils/api-config";
import {ProjectShortDto} from "../dto/project";
import * as http from "http";
import {ProjectDetailsIntroPageDto} from "../dto/projectPages";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private static readonly RESPONSE_INTERVAL: number = 1500
  private projects: Project[] = [{
    title: new MultilingualText(
      "cs", [
        {text: "Válka na Ukrajině", languageCode: "cs"},
        {text: "Animals invasion to Ukraine", languageCode: "en"}
      ]
    ),
    description: new MultilingualText(
      "cs",
      [{text: "Válka na Ukrajině začala v únoru 2022 a měla velký dopad na život v celé Evropě", languageCode: "cs"}]
    ),
    slug: "ukrajina",
    creationDate: new Date(2022, 0, 1),
    publishDate: new Date(2022, 1, 2),
    catastropheType: CatastropheType.WAR
  }, {
    title: new MultilingualText("cs", [{text: "Povodně 2022", languageCode: "cs"}]),
    description: new MultilingualText(
      "cs", [{text: "Povodně při nichž byla vyplaveno mnoho oblastí celé ČR", languageCode: "cs"}]
    ),
    slug: "povodně-2022",
    creationDate: new Date(2022, 0, 1),
    publishDate: new Date(2022, 1, 3),
    catastropheType: CatastropheType.FLOODING
  }, {
    title: new MultilingualText("cs", [{text: "Blizzard 2022", languageCode: "cs"}]),
    description: new MultilingualText("cs", [{text: "Velká sněhová vánice", languageCode: "cs"}]),
    slug: "blizzard-2022",
    creationDate: new Date(2022, 0, 1),
    publishDate: new Date(2022, 1, 4),
    catastropheType: CatastropheType.HURRICANE
  }, {
    title: new MultilingualText("cs", [{text: "Blizzard 2023", languageCode: "cs"}]),
    description: new MultilingualText("cs", [{text: "Velká sněhová vánice", languageCode: "cs"}]),
    slug: "blizzard-2023",
    creationDate: new Date(2022, 0, 1),
    publishDate: new Date(2023, 1, 5),
    catastropheType: CatastropheType.HURRICANE
  }, {
    title: new MultilingualText(
      "cs", [{text: "Válka na Ukrajině", languageCode: "cs"}, {text: "Animals invasion to Ukraine", languageCode: "en"}]
    ),
    description: new MultilingualText(
      "cs",
      [{text: "Válka na Ukrajině začala v únoru 2022 a měla velký dopad na život v celé Evropě", languageCode: "cs"}]
    ),
    slug: "ukrajina-1",
    creationDate: new Date(2022, 0, 1),
    publishDate: new Date(2022, 1, 6),
    catastropheType: CatastropheType.WAR
  }, {
    title: new MultilingualText("cs", [{text: "Povodně 2023", languageCode: "cs"}]),
    description: new MultilingualText(
      "cs", [
        {text: "Povodně při nichž byla vyplaveno mnoho oblastí celé ČR", languageCode: "cs"},
        {text: "Floodings you don't wanna see", languageCode: "en"}
      ],
    ),
    slug: "povodně-2023",
    creationDate: new Date(2023, 0, 1),
    publishDate: new Date(2023, 1, 7),
    catastropheType: CatastropheType.FLOODING
  }, {
    title: new MultilingualText("cs", [{text: "Blizzard 2022/2023", languageCode: "cs"}]),
    description: new MultilingualText("cs", [{text: "Velká sněhová vánice", languageCode: "cs"}]),
    slug: "blizzard-2022-2023",
    creationDate: new Date(2022, 0, 1),
    publishDate: new Date(2022, 1, 8),
    catastropheType: CatastropheType.HURRICANE
  }, {
    title: new MultilingualText("cs", [{text: "Blizzard 2023/2024", languageCode: "cs"}]),
    description: new MultilingualText("cs", [{
      languageCode: "cs",
      text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Vestibulum fermentum tortor id mi. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam dapibus fermentum ipsum. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Etiam bibendum elit eget erat. Mauris elementum mauris vitae tortor. Fusce wisi. " +
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Vestibulum fermentum tortor id mi. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam dapibus fermentum ipsum. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Etiam bibendum elit eget erat. Mauris elementum mauris vitae tortor. Fusce wisi. " +
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Vestibulum fermentum tortor id mi. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam dapibus fermentum ipsum. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Etiam bibendum elit eget erat. Mauris elementum mauris vitae tortor. Fusce wisi. "
    }]),
    slug: "blizzard-2023-2024",
    creationDate: new Date(2023, 0, 1),
    publishDate: new Date(2023, 1, 2),
    catastropheType: CatastropheType.HURRICANE
  }]

  private static readonly PROJECTS_MAIN_PAGE_COMMON = 'details'

  projectDetailsPages: { projectSlug: string, detailsPage: ProjectDetailsIntroPage }[] = [
    {
      projectSlug: 'ukrajina',
      detailsPage: {
        title: new MultilingualText(
          "cs", [
            {text: "Válka na Ukrajině", languageCode: "cs"},
            {text: "Animals invasion to Ukraine", languageCode: "en"}
          ]
        ),
        description: new MultilingualText(
          "cs",
          [{
            text: "Válka na Ukrajině začala v únoru 2022 a měla velký dopad na život v celé Evropě",
            languageCode: "cs"
          }]
        ),
        //Real slug would be something like ukrajina-intro-gallery
        gallerySlug: 'universal-intro-gallery'
      }
    }
  ]

  private _currentProjectSlug$ = new BehaviorSubject<Nullable<string> | undefined>(null)

  importantInformation: ImportantInformation[] = [
    {
      title: MultilingualText.of({text: 'seznam.cz', languageCode: 'cs'}),
      text: MultilingualText.of({
        text: 'Najdete zde co neznáte. Najdete zde co neznáte. Najdete zde co neznáte. Najdete zde co neznáte. Najdete zde co neznáte. Najdete zde co neznáte. ',
        languageCode: 'cs'
      }),
      links: [{title: MultilingualText.of({text: 'seznam.cz', languageCode: 'cs'}), location: 'https://www.seznam.cz'}]
    }
  ]

  constructor(private translateService: TranslateService,
              private projectConverter: ProjectConverter,
              private httpClient: HttpClient
  ) {
  }

  private matchesFilter(project: Project, filter: ProjectFilter): boolean {
    return (
      (isObjectNullOrUndefined(filter.title) || project.title.textWithSameLanguageOrDefaultContains(filter.title))
      && (
        isObjectNullOrUndefined(filter.publishedAfter)
        || (!!project.publishDate && isBefore(startOfDay(filter.publishedAfter), endOfDay(project.publishDate)))
      )
      && (
        isObjectNullOrUndefined(filter.publishedBefore)
        || (!!project.publishDate && isAfter(endOfDay(filter.publishedBefore), startOfDay(project.publishDate)))
      )
    )
  }

  private filterProjects(projects: Project[], pageRequest: PageRequest, filter?: ProjectFilter): Page<Project> {
    //TODO: Remove this function, when server side filtering is done
    const compareFn = (firstProject: Project, secondProject: Project) => {
      return secondProject.creationDate.getMilliseconds() - firstProject.creationDate.getMilliseconds()
    }
    const orderedProjects = [...projects].sort(compareFn)
    const filteredProjects
      = filter ? orderedProjects.filter((project) => this.matchesFilter(project, filter)) : projects
    return pageFromItems(filteredProjects, pageRequest)
  }

  /**
   * Get all available projects filtered according to given filter
   *
   * @param pageRequest Requested page with projects page info
   * @param filter Filter by which projects should be selected
   */
  public getPage$(pageRequest: PageRequest, filter?: ProjectFilter): Observable<Page<ProjectShort>> {
    //TODO: Retrieve filtered projects from server instead
    return this.httpClient.post<Page<ProjectShortDto>>(PROJECTS_PAGE_REQUEST_API_URL, {pageRequest, filter} )
      .pipe(
        map((dtosPage) => {
          return mapPageItems(
            dtosPage,
            item => this.projectConverter.projectShortDtoToProjectShort(item)
          )
        })
      )
  }

  public getBySlug(slug: string): Observable<Project | undefined> {
    //TODO: Retrieve filtered projects from server instead
    const project = this.projects.find(listedProject => listedProject.slug === slug)
    if (!project)
      throw new Error("Project with slug " + slug + " not found!")
    return timer(1000).pipe(map(() => project))
  }

  public getShortBySlug(slug: string): Observable<ProjectShort | undefined> {
    return this.httpClient
      .get<ProjectShortDto>(projectShortApiUrl(slug))
      .pipe(map((dto) => this.projectConverter.projectShortDtoToProjectShort(dto)))
  }

  getDetailsPage(projectSlug: string): Observable<ProjectDetailsIntroPage | undefined> {
    return this.httpClient.get<ProjectDetailsIntroPageDto>(projectDetailsPageRetrievalApiURl(projectSlug))
      .pipe(map(page => {
        return this.projectConverter.projectDetailsIntroPageDtoToProjectDetailsIntroPage(page)
      }))
  }

  projectExists(projectSlug: string): Observable<boolean> {
    return this.httpClient.get<boolean>(projectExistsApiUrl(projectSlug))
  }

  getImportantInformation(projectSlug: string): Observable<ImportantInformation[] | undefined> {
    return timer(1000).pipe(
      map(() => {
        if (this.projects.find(project => project.slug.localeCompare(projectSlug) == 0)) {
          return this.importantInformation
        } else return undefined
      })
    )
  }

  public set currentProjectSlug(value: string | null | undefined) {
    this._currentProjectSlug$.next(value);
  }

  public get currentProjectSlug$(): Observable<string | null | undefined> {
    return this._currentProjectSlug$
  }

  public getProjectSlugFromRoute(route: ActivatedRoute): string | undefined {
    return route.snapshot.params['projectSlug']
  }

  public projectMainPageLinkFromProjectSlug(slug?: string) {
    return "/" + this.urlPrefixFromProjectSlug(slug) + ProjectService.PROJECTS_MAIN_PAGE_COMMON
  }

  public urlPrefixFromProjectSlug(slug?: string | null) {
    return slug ? `/project/${slug}/` : '/';
  }

  public routeRelativeToCurrentProject$(path: string): Observable<string> {
    return this.currentProjectSlug$.pipe(
      map(slug => this.urlPrefixFromProjectSlug(slug) + path)
    )
  }

  public currentProjectCatastropheType$(): Observable<CatastropheType | undefined> {
    return this.currentProjectSlug$
      .pipe(
        mergeMap(slug => isObjectNotNullOrUndefined(slug) ? this.getBySlug(slug) : of(null)),
        //When project is not set, there's no catastrophe type
        map(project => project ? project.catastropheType : undefined)
      )

  }
}
