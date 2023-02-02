import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from "./components/projects/projects.component";
import {
  ProjectDetailComponent
} from "./components/project/project-detail/project-detail.component";
import {NotFoundComponent} from "./components/error-pages/not-found.component";
import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {
  ProjectDetailIntroComponent
} from "./components/project/project-detail/project-detail-intro/project-detail-intro.component";
import {ProjectComponent} from "./components/project/project.component";
import {
  ProjectImportantInformationComponent
} from "./components/project/project-detail/project-important-information/project-important-information.component";
import {HelpListComponent} from "./components/project/help-list/help-list.component";
import {AdvertisementDetailComponent} from "./components/project/advertisement-detail/advertisement-detail.component";
import {ErrorComponent} from "./components/error-pages/error/error.component";
import {ForbiddenComponent} from "./components/error-pages/forbidden.component";
import {
  InternalServerErrorComponent
} from "./components/error-pages/internal-server-error.component";
import {Error4xxComponent} from "./components/error-pages/error4xx.component";
import {Error5xxComponent} from "./components/error-pages/error5xx.component";

const reusedOkRoutes : Routes = [
  {path: "projects", component: ProjectsComponent},
  {path: "contact-us", component: ContactUsComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
]

const errorRoutes : Routes = [
  {path: "errors/403", component: ForbiddenComponent},
  {path: "errors/404", component: NotFoundComponent},
  {path: "errors/4xx", component: Error4xxComponent},
  {path: "errors/500", component: InternalServerErrorComponent},
  {path: "errors/5xx", component: Error5xxComponent},
  {path: "**", component: NotFoundComponent}
]

const routes: Routes = [
  //Pages accessible without selected project must be declared first,
  //otherwise "projects" would be considered to be projectSlug
  {path: "", redirectTo: "projects", pathMatch: "full"},
  ...reusedOkRoutes,
  {path: "project/:projectSlug", component: ProjectComponent, children: [
      //We want details page to be the default page of project
      {path: "", redirectTo: "details", pathMatch: "full"},
      ...reusedOkRoutes,
      {path: "details", component: ProjectDetailComponent, children: [
          {path: '', redirectTo: "intro", pathMatch: "full"},
          {path: 'intro', component: ProjectDetailIntroComponent},
          {path: 'important-info', component: ProjectImportantInformationComponent},
      ]},
      {path: 'help-list', component: HelpListComponent},
      {path: 'advertisement/:advertisementId', component: AdvertisementDetailComponent},
      ...errorRoutes
  ]},
  ...errorRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
