import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {map} from "rxjs";
import {ProjectsUiService} from "../../services/projects-ui.service";

@UntilDestroy()
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectsUiService: ProjectsUiService
  ) {
    this.activatedRoute.paramMap
      .pipe(
        map(paramMap => paramMap.get('projectSlug')),
        untilDestroyed(this)
      ).subscribe(slug => this.projectsUiService.currentProjectSlug = slug)
  }
}
