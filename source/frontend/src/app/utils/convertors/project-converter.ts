import {Project, ProjectShort} from "../../models/projects/project";
import {Injectable} from "@angular/core";
import {CatastropheType} from "../../models/projects/catastrophe-type";

@Injectable({
  providedIn: 'root'
})
export class ProjectConverter {
  public detailedToShort(project: Project) : ProjectShort {
    return {slug: project.slug, title: project.title, description: project.description}
  }

  public  catastropheTypeStringToCatastropheType(catastropheTypeString: string) : CatastropheType {
    const catastropheType = catastropheTypeString as CatastropheType
    if(!Object.values(CatastropheType).includes(catastropheType)) {
      throw new Error('Given catastrophe type string is not valid catastrophe type! ' + catastropheTypeString)
    }
    return catastropheType
  }
}
