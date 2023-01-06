import { Component } from '@angular/core';
import {ProjectService} from "./services/project.service";
import {Router} from "@angular/router";
import {ProjectsUiService} from "./services/projects-ui.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'egidio-frontend'

  constructor(private projectService: ProjectService,
              private projectsUiService: ProjectsUiService,
              private router: Router) {
    this.projectsUiService.getCurrentProjectSlug$()
      .subscribe(slug => {
        if(slug && !projectService.getBySlug(slug)) {
          this.router.navigate(['/not-found' ], )
        }
      })
  }
}
