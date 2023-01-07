import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './components/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreviewGridComponent } from './components/preview-grid/preview-grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyModule} from "@ngx-formly/core";
import {FormlyMaterialModule} from "@ngx-formly/material";
import {
  FormlyMatDatepickerModule
} from "@ngx-formly/material/datepicker";
import {
  MAT_DATE_FORMATS, MAT_DATE_LOCALE,
  MatNativeDateModule
} from "@angular/material/core";
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import {FormlyPresetModule} from "@ngx-formly/core/preset";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { NgxDropzoneModule } from "ngx-dropzone";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    HeaderComponent,
    PreviewGridComponent,
    ProjectDetailComponent,
    NotFoundComponent,
    ContactUsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    FormlyPresetModule,
    FormlyModule.forRoot({
      presets: [
        {
          name: 'firstname',
          config: {
            key: 'firstname',
            type: 'input',
            props: {
              label: 'First Name',
            },
          },
        }, {
          name: 'lastname',
          config: {
            key: 'lastname',
            type: 'input',
            props: {
              label: 'Last Name',
            },
          },
        }
      ]
    }),
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDropzoneModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    MatSelectModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'cs-CZ' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
