import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from "./components/projects/projects.component";
import {
  ProjectDetailComponent
} from "./components/project-detail/project-detail.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {ContactUsComponent} from "./components/contact-us/contact-us.component";

const routes: Routes = [
  //Pages accessible without selected project must be declared first,
  //otherwise "projects" would be considered to be projectSlug
  {path: "", redirectTo: "projects", pathMatch: "full"},
  {path: "projects", component: ProjectsComponent},
  {path: "contact-us", component: ContactUsComponent},
  {path: "project/:projectSlug", children: [
      //We want details page to be the default page of project
      {path: "", redirectTo: "details", pathMatch: "full"},
      {path: "details", component: ProjectDetailComponent},
      {path: "projects", component: ProjectsComponent},
      {path: "contact-us", component: ContactUsComponent}
  ]},
  {path: "**", component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
