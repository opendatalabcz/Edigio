import {Injectable} from '@angular/core';
import {Project, ProjectShort} from "../models/projects/project";
import {ProjectFilter} from "../models/projects/project-filter";
import {BehaviorSubject, map, mergeMap, Observable, of} from "rxjs";
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
import {Nullable} from "../utils/types/common";
import {HttpClient} from "@angular/common/http";
import {
  projectDetailsPageRetrievalApiURl,
  projectExistsAndAccessibleApiUrl,
  projectImportantInformation,
  PROJECTS_PAGE_REQUEST_API_URL,
  projectShortApiUrl
} from "../utils/api-config";
import {ProjectShortDto} from "../dto/project";
import {ImportantInformationDto, ProjectDetailsIntroPageDto} from "../dto/projectPages";
import {ImportantInformationConverter} from "../utils/convertors/important-information";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private static readonly RESPONSE_INTERVAL: number = 1500

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
              private importantInformationConverter: ImportantInformationConverter,
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
    return this.httpClient.post<Page<ProjectShortDto>>(PROJECTS_PAGE_REQUEST_API_URL, {pageRequest, filter})
      .pipe(
        map((dtosPage) => {
          return mapPageItems(
            dtosPage,
            item => this.projectConverter.projectShortDtoToProjectShort(item)
          )
        })
      )
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

  projectExistsAndAccessible(projectSlug: string): Observable<boolean> {
    return this.httpClient.get<boolean>(projectExistsAndAccessibleApiUrl(projectSlug))
  }

  getImportantInformation(projectSlug: string): Observable<ImportantInformation[] | undefined> {
    return this.httpClient.get<ImportantInformationDto[]>(projectImportantInformation(projectSlug))
      .pipe(
        map(info => info.map(
          singleInfo => this.importantInformationConverter
            .importantInformationDtoToImportantInformation(singleInfo)
        ))
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
      .pipe(map(() => CatastropheType.CRIMINALITY))
  }
}
