import {Injectable} from '@angular/core';
import {Project, ProjectShort} from "../models/projects/project";
import {ProjectFilter} from "../models/projects/project-filter";
import {NotFoundError} from "rxjs";
import {CatastropheType} from "../models/projects/catastrophe-type";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [{
    title: "Válka na ukrajině",
    description: "Válka na Ukrajině začala v únoru 2022 a měla velký dopad na život v celé Evropě",
    slug: "ukrajina",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 2),
    catastropheType: CatastropheType.WAR
  },{
    title: "Povodně 2022",
    description: "Povodně při nichž byla vyplaveno mnoho oblastí celé ČR",
    slug: "povodně-2022",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 3),
    catastropheType: CatastropheType.FLOODING
  },{
    title: "Blizzard 2022",
    description: "Velká sněhová vánice",
    slug: "blizzard-2022",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 4),
    catastropheType: CatastropheType.HURRICANE
  },{
    title: "Blizzard 2023",
    description: "Velká sněhová vánice",
    slug: "blizzard-2023",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2023, 2, 5),
    catastropheType: CatastropheType.HURRICANE
  },{
    title: "Válka na ukrajině",
    description: "Válka na Ukrajině začala v únoru 2022 a měla velký dopad na život v celé Evropě",
    slug: "ukrajina",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 6),
    catastropheType: CatastropheType.WAR
  },{
    title: "Povodně 2022",
    description: "Povodně při nichž byla vyplaveno mnoho oblastí celé ČR",
    slug: "povodně-2022",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 7),
    catastropheType: CatastropheType.FLOODING
  },{
    title: "Blizzard 2022",
    description: "Velká sněhová vánice",
    slug: "blizzard-2022",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 8),
    catastropheType: CatastropheType.HURRICANE
  },{
    title: "Blizzard 2023",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Vestibulum fermentum tortor id mi. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam dapibus fermentum ipsum. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Etiam bibendum elit eget erat. Mauris elementum mauris vitae tortor. Fusce wisi. " +
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Vestibulum fermentum tortor id mi. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam dapibus fermentum ipsum. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Etiam bibendum elit eget erat. Mauris elementum mauris vitae tortor. Fusce wisi. " +
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Vestibulum fermentum tortor id mi. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam dapibus fermentum ipsum. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Etiam bibendum elit eget erat. Mauris elementum mauris vitae tortor. Fusce wisi. ",
    slug: "blizzard-2023",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2023, 2, 2),
    catastropheType: CatastropheType.HURRICANE
  }]

  constructor() { }

  private filterProjects(projects: Project[], filter?: ProjectFilter) : Project[] {
    //TODO: Remove this function, when server side filtering is done
    if(!filter)
      return projects
    else
      return projects.filter(project => {
        return (
          (!filter.title || project.title.match(".*" + filter.title + ".*"))
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
  public getAll(filter?: ProjectFilter) : Project[] {
    //TODO: Retrieve filtered projects from server instead
    return this.filterProjects(this.projects, filter)
  }

  private mapToShortForm(project: Project) : ProjectShort {
    return {title: project.title, slug: project.slug }
  }

  public getAllShort(filter?: ProjectFilter) : ProjectShort[] {
    //TODO: Retrieve filtered projects from server instead
    return this.filterProjects(this.projects, filter)
      .map(project => this.mapToShortForm(project))
  }

  public getBySlug(slug: string) : Project {
    //TODO: Retrieve filtered projects from server instead
    const project = this.projects.find(project => project.slug === slug)
    if(!project)
      throw new NotFoundError("Project with slug " + slug + " not found!")
    return project
  }

  public getShortBySlug(slug: string) : ProjectShort {
    const project = this.getBySlug(slug)
    return this.mapToShortForm(project)
  }
}
