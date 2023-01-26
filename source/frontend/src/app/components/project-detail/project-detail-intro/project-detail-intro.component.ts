import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {first} from "rxjs";
import {ProjectService} from "../../../services/project.service";
import {ProjectDetailsIntroPage} from "../../../models/projects/projectPages";

@Component({
  selector: 'app-project-detail-intro',
  templateUrl: './project-detail-intro.component.html',
  styleUrls: ['./project-detail-intro.component.scss']
})
export class ProjectDetailIntroComponent implements OnInit {
  @Output() projectLoaded: EventEmitter<void> = new EventEmitter<void>()

  page?: ProjectDetailsIntroPage

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    console.log('here')
  }

}
