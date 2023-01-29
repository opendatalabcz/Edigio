import {Component} from '@angular/core';
import {ProjectService} from "./services/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {DateAdapter} from '@angular/material/core';
import {cs} from "date-fns/locale";
import {Notify} from "notiflix";
import {map} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'egidio-frontend'

  constructor(private projectService: ProjectService,
              private translate: TranslateService,
              private dateAdapter: DateAdapter<Date>) {
    this.setupDateLocales()
    this.setupTranslations()
    Notify.init({
      cssAnimationStyle: "zoom",
      clickToClose: true,
      //TODO: Take a look at this, if there's enough time later on (not a crucial task, but it would be nice to have)
      //  This settings is the reason, why notification won't disappear automatically
      //  Therefor I decided to disable it (notifications are still closable by clicking on them)
      //  Wasn't able to find a fix for both of these functionalities to work together
      //closeButton: true,
    })
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
