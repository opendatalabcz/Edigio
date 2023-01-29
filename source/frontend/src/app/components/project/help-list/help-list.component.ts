import { Component } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ProjectService} from "../../../services/project.service";

@Component({
  selector: 'app-help-list',
  templateUrl: './help-list.component.html',
  styleUrls: ['./help-list.component.scss']
})
export class HelpListComponent {
  form: FormGroup = new FormGroup([]);
  showBeforeEarlierThanAfterError?: boolean;

  constructor(private projectService: ProjectService) {}

  onSubmit(form: FormGroup) {

  }

  public get isFilterFormValid() : boolean {
    return !this.form.errors
  }
}
