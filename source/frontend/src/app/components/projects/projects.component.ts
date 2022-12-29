import {Component, Input, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {GridItem} from "../../models/preview-grid/grid-item";
import {Project} from "../../models/projects/project";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  public projects: GridItem[] = []
  constructor(private projectsService: ProjectService,
              private projectsUiService: ProjectsUiService) {

  }

  ngOnInit() {
    this.projects = this.projectsService.getAll()
      .map((project) => this.projectToGridItem(project))
  }

  private projectToGridItem(project: Project) : GridItem {
    return {
      title: project.title,
      text: project.description,
      buttonsData: [{
        text: "To project",
        link: this.projectsUiService.projectMainPageLinkFromProjectSlug(
          project.slug
        )
      }]
    }
  }
}
