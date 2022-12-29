import {Component, OnInit} from '@angular/core';
import {Project} from "../../models/project";
import {ActivatedRoute} from "@angular/router";
import {ProjectsComponent} from "../projects/projects.component";
import {ProjectsUiService} from "../../ui/projects-ui.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  constructor(private projectsUiService: ProjectsUiService,
              private activatedRoute: ActivatedRoute) {}
  public project?: Project;
  public projectPrefix?: string

  ngOnInit() {
    this.project = this.projectsUiService.getCurrentProjectFromRoute(
      this.activatedRoute
    );
    this.projectPrefix = ProjectsUiService.urlPrefixFromProjectSlug(
      this.project?.slug
    )
  }

}
