import {Component,} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent {

  constructor(protected projectService: ProjectService) {
  }

}
