import { Component } from '@angular/core';
import {ProjectService} from "./services/project.service";
import {Router} from "@angular/router";
import {ProjectsUiService} from "./services/projects-ui.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'egidio-frontend'

  constructor(private projectService: ProjectService,
              private projectsUiService: ProjectsUiService,
              private router: Router,
              private translate: TranslateService) {
    this.projectsUiService.getCurrentProjectSlug$()
      .subscribe(slug => {
        if(slug && !projectService.getBySlug(slug)) {
          this.router.navigate(['/not-found' ], )
        }
      })
    translate.setDefaultLang('en')
    translate.addLangs(['cs'])
    translate.use('en')
  }
}
