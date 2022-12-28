import { Component } from '@angular/core';
import {GridItem} from "../../models/GridItem";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  public projects: GridItem[] = [{
    title: "Hello There!",
    text: "General Kenobi!",
    buttonsData: [{text: "Answer", link: "/projects"}]
  },{
    title: "Suprise to be sure!",
    text: "But welcome one!",
    buttonsData: []
  },{
    title: "Suprise to be sure!",
    text: "But welcome one!",
    buttonsData: []
  },{
    title: "Hello There!",
    text: "General Kenobi!",
    buttonsData: []
  }]
}
