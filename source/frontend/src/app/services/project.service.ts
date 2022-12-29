import { Injectable } from '@angular/core';
import {Project, ProjectShort} from "../models/projects/project";
import {ProjectFilter} from "../models/projects/project-filter";
import {NotFoundError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [{
    title: "Válka na ukrajině",
    description: "Válka na Ukrajině začala v únoru 2022 a měla velký dopad na život v celé Evropě",
    slug: "ukrajina",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 2)
  },{
    title: "Povodně 2022",
    description: "Povodně při nichž byla vyplaveno mnoho oblastí celé ČR",
    slug: "povodně-2022",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 2)
  },{
    title: "Blizzard 2022",
    description: "Velká sněhová vánice",
    slug: "blizzard-2022",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 2)
  },{
    title: "Blizzard 2022",
    description: "Velká sněhová vánice",
    slug: "blizzard-2023",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 2)
  },{
    title: "Válka na ukrajině",
    description: "Válka na Ukrajině začala v únoru 2022 a měla velký dopad na život v celé Evropě",
    slug: "ukrajina",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 2)
  },{
    title: "Povodně 2022",
    description: "Povodně při nichž byla vyplaveno mnoho oblastí celé ČR",
    slug: "povodně-2022",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 2)
  },{
    title: "Blizzard 2022",
    description: "Velká sněhová vánice",
    slug: "blizzard-2022",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 2)
  },{
    title: "Blizzard 2022",
    description: "Velká sněhová vánice",
    slug: "blizzard-2023",
    creationDate: new Date(2022, 1, 1),
    publishDate: new Date(2022, 2, 2)
  }]

  constructor() { }

  private filterProjects(projects: Project[], filter?: ProjectFilter) : Project[] {
    //TODO: Remove this function, when server side filtering is done
    if(!filter)
      return projects
    else
      return projects.filter(project => {
        return (
          (!filter.titleFilter || project.title.match(".*" + filter.titleFilter + ".*"))
          && (
            !filter.publishedAfter
            || (project.publishDate && filter.publishedAfter <= project.publishDate)
          )
          && (
            !filter.publishedBefore
            || (project.publishDate && filter.publishedBefore >= project.publishDate)
          )
        )
      })
  }

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
