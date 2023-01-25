import {Component, OnInit,} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {first} from "rxjs";
import {ProjectDetailsPage} from "../../models/projects/project";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LoadingType, NotificationService} from "../../services/notification.service";

@UntilDestroy()
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit{
  _page?: ProjectDetailsPage

  slug?: string

  constructor(
    private projectService: ProjectService,
    private projectsUiService: ProjectsUiService,
    private notificationService: NotificationService
  ) {}

  set page(value: ProjectDetailsPage | undefined) {
    this._page = value
  }

  get page() : ProjectDetailsPage | undefined {
    return this._page
  }

  ngOnInit(): void {
    this.notificationService.startLoading("NOTIFICATIONS.LOADING", true, LoadingType.LOADING)
    this.projectsUiService.getCurrentProjectSlug$()
      .pipe(untilDestroyed(this))
      .subscribe(slug => this.slug = slug)
  }

  onSubpageLoaded() {
    this.notificationService.stop_loading()
  }
}
