import {Component} from '@angular/core';
import {ProjectService} from "./services/project.service";
import {Router} from "@angular/router";
import {ProjectsUiService} from "./services/projects-ui.service";
import {TranslateService} from "@ngx-translate/core";
import {DateAdapter} from '@angular/material/core';
import {cs} from "date-fns/locale";

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
              private translate: TranslateService,
              private dateAdapter: DateAdapter<Date>) {
    this.projectsUiService.getCurrentProjectSlug$()
      .subscribe(slug => {
        if (slug && !projectService.getBySlug(slug)) {
          this.router.navigate(['/not-found'],)
        }
      })
    this.setupDateLocales()
    this.setupTranslations()
  }

  private setupDateLocales() {
    this.dateAdapter.setLocale(cs)
  }

  private setupTranslations() {
    this.translate.setDefaultLang('en')
    this.translate.addLangs(['cs'])
    this.translate.use('en')
  }
}
