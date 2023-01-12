import {Project, ProjectShort} from "../../models/projects/project";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ProjectConverter {
  public detailedToShort(project: Project) : ProjectShort {
    return {slug: project.slug, title: project.title}
  }
}
