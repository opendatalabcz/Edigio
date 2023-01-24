import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ProjectsComponent} from './components/projects/projects.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HeaderComponent} from './components/header/header.component';
import {PreviewGridComponent} from './components/preview-grid/preview-grid.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {ProjectDetailComponent} from './components/project-detail/project-detail.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyModule} from "@ngx-formly/core";
import {FormlyMaterialModule} from "@ngx-formly/material";
import {FormlyMatDatepickerModule} from "@ngx-formly/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ContactUsComponent} from './components/contact-us/contact-us.component';
import {FormlyPresetModule} from "@ngx-formly/core/preset";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgxDropzoneModule} from "ngx-dropzone";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {FooterComponent} from './components/footer/footer.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateFnsModule, MatDateFnsModule} from "@angular/material-date-fns-adapter";
import {cs} from "date-fns/locale";
import { LoginComponent } from './components/login/login.component';
import { NotificationComponent } from './components/notification/notification.component';
import { RegisterComponent } from './components/register/register.component';
import {MatPasswordStrengthModule} from "@angular-material-extensions/password-strength";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";


// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
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
    FooterComponent,
    LoginComponent,
    NotificationComponent,
    RegisterComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
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
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        HttpClientModule,
        MatSelectModule,
        MatToolbarModule,
        MatDatepickerModule,
        DateFnsModule,
        MatDateFnsModule,
        MatPasswordStrengthModule,
        MatCheckboxModule,
        RxReactiveFormsModule,
    ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: cs}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
