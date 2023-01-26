import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {mergeMap, of} from "rxjs";
import {ProjectService} from "../../../../services/project.service";
import {ProjectDetailsIntroPage} from "../../../../models/projects/projectPages";
import {ProjectsUiService} from "../../../../services/projects-ui.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LoadingType, NotificationService} from "../../../../services/notification.service";

@UntilDestroy()
@Component({
  selector: 'app-project-detail-intro',
  templateUrl: './project-detail-intro.component.html',
  styleUrls: ['./project-detail-intro.component.scss']
})
export class ProjectDetailIntroComponent implements OnInit {
  @Output() projectLoaded: EventEmitter<void> = new EventEmitter<void>()

  page?: ProjectDetailsIntroPage

  constructor(
    private projectService: ProjectService,
    private projectsUiService: ProjectsUiService,
    private notificationService: NotificationService
  ) {
    this.notificationService.startLoading('NOTIFICATIONS.LOADING', true, LoadingType.LOADING)
    this.projectsUiService.currentProjectSlug$
      .pipe(
        mergeMap(slug => slug ? this.projectService.getDetailsPage(slug) : of(undefined)),
        untilDestroyed(this)
      )
      .subscribe(page => {
        this.page = page
        this.notificationService.stopLoading()
      })
  }

  ngOnInit() {
    console.log('here')
  }

}
