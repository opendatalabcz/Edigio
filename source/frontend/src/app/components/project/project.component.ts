import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {first, map, mergeMap, of} from "rxjs";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {ProjectService} from "../../services/project.service";

@UntilDestroy()
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectsUiService: ProjectsUiService,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.activatedRoute.paramMap
      .pipe(
        map(paramMap => paramMap.get('projectSlug')),
        untilDestroyed(this)
      ).subscribe(slug => {
      this.projectsUiService.currentProjectSlug = slug
      if(slug) {
        this.projectService.projectExists(slug)
          .pipe(first())
          .subscribe(exists => {
            console.log(exists)
            if(!exists) {
              this.router.navigate(['/not-found'])
            }
          })
      }
    })
  }
}
