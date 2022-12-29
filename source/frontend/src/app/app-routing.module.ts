import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from "./components/projects/projects.component";
import {
  ProjectDetailComponent
} from "./components/project-detail/project-detail.component";

const routes: Routes = [
  //Pages accessible without selected project must be declared first,
  //otherwise "projects" would be considered to be projectSlug
  {path: "", redirectTo: "projects", pathMatch: "full"},
  {path: "projects", component: ProjectsComponent},
  {path: ":projectSlug", children: [
      //We want details page to be the default page of project
      {path: "", redirectTo: "details", pathMatch: "full"},
      {path: "details", component: ProjectDetailComponent},
      {path: "projects", component: ProjectsComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
