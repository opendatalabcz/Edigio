import {Injectable} from '@angular/core';
import {Project, ProjectShort} from "../models/projects/project";
import {ProjectFilter} from "../models/projects/project-filter";
import { map, NotFoundError, Observable, of, Subject} from "rxjs";
import {CatastropheType} from "../models/projects/catastrophe-type";
import {MultilingualText} from "../models/common/multilingual-text";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [{
    title: new MultilingualText(
      "cs", [
        {text: "Válka na Ukrajině", lang: "cs"},
        {text: "Animals invasion to Ukraine", lang: "en" }
      ]
    ),
    description: new MultilingualText(
      "cs",
      [{text: "Válka na Ukrajině začala v únoru 2022 a měla velký dopad na život v celé Evropě", lang: "cs"}]
    ),
    slug: "ukrajina",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 2),
    catastropheType: CatastropheType.WAR
  },{
    title: new MultilingualText("cs", [{text: "Povodně 2022", lang: "cs"}]),
    description: new MultilingualText(
      "cs", [{text: "Povodně při nichž byla vyplaveno mnoho oblastí celé ČR", lang: "cs"}]
    ),
    slug: "povodně-2022",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 3),
    catastropheType: CatastropheType.FLOODING
  },{
    title: new MultilingualText("cs", [{text: "Blizzard 2022", lang: "cs" }]),
    description: new MultilingualText("cs", [{text: "Velká sněhová vánice", lang: "cs"}]),
    slug: "blizzard-2022",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 4),
    catastropheType: CatastropheType.HURRICANE
  },{
    title: new MultilingualText("cs", [{text: "Blizzard 2023", lang: "cs" }]),
    description: new MultilingualText("cs", [{text: "Velká sněhová vánice", lang: "cs"}]),
    slug: "blizzard-2023",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2023, 2, 5),
    catastropheType: CatastropheType.HURRICANE
  },{
    title: new MultilingualText(
      "cs", [{text: "Válka na Ukrajině", lang: "cs"}, {text: "Animals invasion to Ukraine", lang: "en" }]
    ),
    description: new MultilingualText(
      "cs",
      [{text: "Válka na Ukrajině začala v únoru 2022 a měla velký dopad na život v celé Evropě", lang: "cs"}]
    ),
    slug: "ukrajina-1",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 6),
    catastropheType: CatastropheType.WAR
  },{
    title: new MultilingualText("cs", [{text: "Povodně 2023", lang: "cs"}]),
    description: new MultilingualText(
      "cs", [{text: "Povodně při nichž byla vyplaveno mnoho oblastí celé ČR", lang: "cs"}]
    ),
    slug: "povodně-2023",
    creationDate: new Date(2023, 1, 1),
    publishDate: new Date(2023, 2, 7),
    catastropheType: CatastropheType.FLOODING
  },{
    title: new MultilingualText("cs", [{text: "Blizzard 2022/2023", lang: "cs" }]),
    description: new MultilingualText("cs", [{text: "Velká sněhová vánice", lang: "cs"}]),
    slug: "blizzard-2022-2023",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 8),
    catastropheType: CatastropheType.HURRICANE
  },{
    title: new MultilingualText("cs", [{text: "Blizzard 2023/2024", lang: "cs" }]),
    description: new MultilingualText("cs", [{lang: "cs", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Vestibulum fermentum tortor id mi. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam dapibus fermentum ipsum. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Etiam bibendum elit eget erat. Mauris elementum mauris vitae tortor. Fusce wisi. " +
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Vestibulum fermentum tortor id mi. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam dapibus fermentum ipsum. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Etiam bibendum elit eget erat. Mauris elementum mauris vitae tortor. Fusce wisi. " +
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Vestibulum fermentum tortor id mi. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam dapibus fermentum ipsum. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Etiam bibendum elit eget erat. Mauris elementum mauris vitae tortor. Fusce wisi. " }]),
    slug: "blizzard-2023-2024",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2023, 2, 2),
    catastropheType: CatastropheType.HURRICANE
  }]

  private projects$ = new Subject<Project>()

  private currentLanguage: string

  constructor(private translateService: TranslateService) {
    this.currentLanguage = translateService.currentLang
    this.translateService.onLangChange.subscribe(event => this.currentLanguage = event.lang)
  }

  private filterProjects(projects: Project[], filter?: ProjectFilter) : Project[] {
    //TODO: Remove this function, when server side filtering is done
    if(!filter)
      return projects
    else
      return projects.filter(project => {
        return (
          (!filter.title || project.title.getTextForLanguageOrDefault("cs").text.match(".*" + filter.title + ".*"))
          && (
            !filter.publishedAfter
            || (project.publishDate && filter.publishedAfter.getTime() <= project.publishDate.getTime())
          )
          && (
            !filter.publishedBefore
            || (project.publishDate && filter.publishedBefore.getTime() >= project.publishDate.getTime())
          )
          && (filter.catastropheTypes.length == 0
            || filter.catastropheTypes.indexOf(project.catastropheType) >= 0)
        )
      })
  }

  /**
   * Get all available projects filtered according to given filter
   *
   * @param filter Filter by which projects should be selected
   */
  public getAll(filter?: ProjectFilter) : Observable<Project[]> {
    //TODO: Retrieve filtered projects from server instead
    return of(this.filterProjects(this.projects, filter))
  }

  private mapToShortForm(project: Project) : ProjectShort {
    return {title: project.title, slug: project.slug }
  }

  public getAllShort(filter?: ProjectFilter) : ProjectShort[] {
    //TODO: Retrieve filtered projects from server instead
    return this.filterProjects(this.projects, filter)
      .map((project: Project) => project == undefined ? project : this.mapToShortForm(project))
  }

  public getBySlug(slug: string) : Observable<Project | undefined> {
    //TODO: Retrieve filtered projects from server instead
    const project = this.projects.find(listedProject => listedProject.slug === slug)
    if(!project)
      throw new Error("Project with slug " + slug + " not found!")
    return of(project)
  }

  public getShortBySlug(slug: string) : Observable<ProjectShort | undefined> {
    return this.getBySlug(slug)
      .pipe(
        map(project => project ? this.mapToShortForm(project) : undefined)
      )
  }
}
