import {Component, OnInit,} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {ProjectsUiService} from "../../../services/projects-ui.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LoadingType, NotificationService} from "../../../services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs";

@UntilDestroy()
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent{

  constructor(protected projectsUiService: ProjectsUiService) {}
}
