import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {first, map} from "rxjs";
import {ProjectService} from "../../services/project.service";

@UntilDestroy()
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.activatedRoute.paramMap
      .pipe(
        map(paramMap => paramMap.get('projectSlug')),
        untilDestroyed(this)
      ).subscribe(slug => {
      if (slug) {
        //TODO: Think about downloading project instead of just asking for its existence,
        // project might exist, but it still might not be accessible to user, so we would be able to check it here
        this.projectService.projectExistsAndAccessible(slug)
          .pipe(first())
          .subscribe(exists => {
            if (!exists) {
              this.router.navigate(['/not-found'])
            } else {
              this.projectService.currentProjectSlug = slug
            }
          })
      }
    })
  }

  ngOnDestroy(): void {
    //This component shouldn't be destroyed without deselecting project.
    //It also shouldn't be possible to deselect project without this component being destroyed
    //Therefore this place seems to be the most suitable for telling service that the project was deselected
    this.projectService.currentProjectSlug = null
  }
}
