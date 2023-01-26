import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from "./components/projects/projects.component";
import {
  ProjectDetailComponent
} from "./components/project/project-detail/project-detail.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {
  ProjectDetailIntroComponent
} from "./components/project/project-detail/project-detail-intro/project-detail-intro.component";

const routes: Routes = [
  //Pages accessible without selected project must be declared first,
  //otherwise "projects" would be considered to be projectSlug
  {path: "", redirectTo: "projects", pathMatch: "full"},
  {path: "projects", component: ProjectsComponent},
  {path: "contact-us", component: ContactUsComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "project/:projectSlug", children: [
      //We want details page to be the default page of project
      {path: "", redirectTo: "details", pathMatch: "full"},
      {path: "details", component: ProjectDetailComponent, children: [
          {path: '', redirectTo: "intro", pathMatch: "full"},
          {path: 'intro', component: ProjectDetailIntroComponent}
      ]},
      {path: "projects", component: ProjectsComponent},
      {path: "contact-us", component: ContactUsComponent},
      {path: "login", component: LoginComponent},
      {path: "**", component: NotFoundComponent}
  ]},
  {path: "**", component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
