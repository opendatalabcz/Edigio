import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {mergeMap, of} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ProjectsUiService} from "../../../../services/projects-ui.service";
import {ProjectService} from "../../../../services/project.service";
import {LoadingType, NotificationService} from "../../../../services/notification.service";

@UntilDestroy()
@Component({
  selector: 'app-project-important-information',
  templateUrl: './project-important-information.component.html',
  styleUrls: ['./project-important-information.component.scss']
})
export class ProjectImportantInformationComponent implements OnInit{

  @Input() slug?: string
  @Output() informationLoaded: EventEmitter<void> = new EventEmitter<void>()

  constructor(private projectsUiService: ProjectsUiService,
              private projectService: ProjectService,
              private notificationService: NotificationService) {
    notificationService.startLoading('NOTIFICATIONS.LOADING', true, LoadingType.LOADING)
    this.projectsUiService.currentProjectSlug$
      .pipe(
        mergeMap(slug => slug ? this.projectService.getImportantInformation(slug) : of(undefined)),
        untilDestroyed(this)
      )
      .subscribe(information => {
        this.notificationService.stopLoading()
      })
  }

  ngOnInit() {
    this.informationLoaded.emit()
  }

}
