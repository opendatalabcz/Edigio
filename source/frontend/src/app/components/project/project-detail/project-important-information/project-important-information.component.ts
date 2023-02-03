import {Component} from '@angular/core';
import {mergeMap, of} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ProjectService} from "../../../../services/project.service";
import {LoadingType, NotificationService} from "../../../../services/notification.service";
import {ImportantInformation, ImportantInformationLink} from "../../../../models/projects/projectPages";
import {GridItem, GridItemButtonData} from "../../../../models/preview-grid/grid-item";
import {MultilingualTextService} from "../../../../services/multilingual-text.service";
import {Link} from "../../../../models/common/link";

@UntilDestroy()
@Component({
  selector: 'app-project-important-information',
  templateUrl: './project-important-information.component.html',
  styleUrls: ['./project-important-information.component.scss']
})
export class ProjectImportantInformationComponent {
  importantInformationGridItems: GridItem[] = []

  constructor(private projectService: ProjectService,
              private notificationService: NotificationService,
              private localizationService: MultilingualTextService) {
    notificationService.startLoading('NOTIFICATIONS.LOADING', true, LoadingType.LOADING)
    this.projectService.currentProjectSlug$
      .pipe(
        mergeMap(slug => slug ? this.projectService.getImportantInformation(slug) : of(undefined)),
        untilDestroyed(this)
      )
      .subscribe(information => {
        this.importantInformationGridItems
          = information ? information.map(info => this.informationToGridItem(info)) : []
        this.notificationService.stopLoading()
      })
  }

  private informationLinksToButtonsData(informationLinks: ImportantInformationLink[]): GridItemButtonData[] {
    return informationLinks.map(
      link => <GridItemButtonData>{
        text: this.localizationService.toLocalizedTextValueForCurrentLanguage$(link.title),
        link: new Link(link.location, true)
      }
    )
  }

  private informationToGridItem(information: ImportantInformation): GridItem {
    return {
      title: this.localizationService.toLocalizedTextValueForCurrentLanguage$(information.title),
      text: this.localizationService.toLocalizedTextValueForCurrentLanguage$(information.text),
      buttonsData: this.informationLinksToButtonsData(information.links)
    }
  }
}
