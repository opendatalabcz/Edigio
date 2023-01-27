import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {map, mergeMap, of} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ProjectsUiService} from "../../../../services/projects-ui.service";
import {ProjectService} from "../../../../services/project.service";
import {LoadingType, NotificationService} from "../../../../services/notification.service";
import {ImportantInformation, ImportantInformationLink} from "../../../../models/projects/projectPages";
import {GridItem, GridItemButtonData} from "../../../../models/preview-grid/grid-item";
import {TranslateService} from "@ngx-translate/core";
import {LocalizationService} from "../../../../services/localization.service";

@UntilDestroy()
@Component({
  selector: 'app-project-important-information',
  templateUrl: './project-important-information.component.html',
  styleUrls: ['./project-important-information.component.scss']
})
export class ProjectImportantInformationComponent {

  private importantInformation?: ImportantInformation[];
  importantInformationGridItems: GridItem[] = []

  constructor(private projectsUiService: ProjectsUiService,
              private projectService: ProjectService,
              private notificationService: NotificationService,
              private localizationService: LocalizationService) {
    notificationService.startLoading('NOTIFICATIONS.LOADING', true, LoadingType.LOADING)
    this.projectsUiService.currentProjectSlug$
      .pipe(
        mergeMap(slug => slug ? this.projectService.getImportantInformation(slug) : of(undefined)),
        untilDestroyed(this)
      )
      .subscribe(information => {
        this.importantInformation = information
        this.importantInformationGridItems
          = information ? information.map(info => this.informationToGridItem(info)) : []
        this.notificationService.stopLoading()
      })
  }

  private informationLinksToButtonsData(informationLinks: ImportantInformationLink[]) : GridItemButtonData[] {
    return informationLinks.map(
      link => <GridItemButtonData>{
        text: this.localizationService.toLocalizedTextValueForCurrentLanguage$(link.title),
        link: link.location,
        isAbsolute: true
      }
    )
  }

  private informationToGridItem(information: ImportantInformation) : GridItem {
    return {
      title: this.localizationService.toLocalizedTextValueForCurrentLanguage$(information.title),
      text: this.localizationService.toLocalizedTextValueForCurrentLanguage$(information.text),
      buttonsData: this.informationLinksToButtonsData(information.links)
    }
  }
}
