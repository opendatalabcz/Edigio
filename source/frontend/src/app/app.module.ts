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
import {ProjectDetailComponent} from './components/project/project-detail/project-detail.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyModule} from "@ngx-formly/core";
import {FormlyMaterialModule} from "@ngx-formly/material";
import {FormlyMatDatepickerModule} from "@ngx-formly/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {NotFoundComponent} from './components/error-pages/not-found.component';
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
import {LoginComponent} from './components/login/login.component';
import {NotificationComponent} from './components/notification/notification.component';
import {RegisterComponent} from './components/register/register.component';
import {MatPasswordStrengthModule} from "@angular-material-extensions/password-strength";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";
import {ShareModule} from "ngx-sharebuttons";
import {MultilingualTextTranslatePipe} from './pipes/multilingual-text-translate.pipe';
import {
  ProjectDetailIntroComponent
} from './components/project/project-detail/project-detail-intro/project-detail-intro.component';
import {PageSidenavComponent} from './components/page-sidenav/page-sidenav.component';
import {
  ProjectImportantInformationComponent
} from './components/project/project-detail/project-important-information/project-important-information.component';
import {ProjectComponent} from './components/project/project.component';
import {GalleryModule} from "ng-gallery";
import {HelpListComponent} from './components/project/help-list/help-list.component';
import {
  AdvertisementDetailComponent
} from './components/advertisement/advertisement-detail/advertisement-detail.component';
import {ForbiddenComponent} from './components/error-pages/forbidden.component';
import {ErrorComponent} from './components/error-pages/error/error.component';
import {InternalServerErrorComponent} from './components/error-pages/internal-server-error.component';
import {Error4xxComponent} from './components/error-pages/error4xx.component';
import {Error5xxComponent} from './components/error-pages/error5xx.component';
import {MatDividerModule} from "@angular/material/divider";
import {MultilingualTextToCurrentLanguagePipe} from './pipes/multilingual-text-to-current-language.pipe';
import {MatTableModule} from "@angular/material/table";
import {
  ListedItemInfoDialogComponent
} from './components/advertisement/listed-item-info-dialog/listed-item-info-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSortModule} from "@angular/material/sort";
import { UserWithReviewComponent } from './components/user-with-review/user-with-review.component';
import { RatedEntityPreviewCardComponent } from './components/rated-entity-preview-card/rated-entity-preview-card.component';
import {BarRatingModule} from "ngx-bar-rating";
import {MatCardModule} from "@angular/material/card";
import { RatedEntityPreviewCardTableComponent } from './components/rated-entity-preview-card/rated-entity-preview-card-table/rated-entity-preview-card-table.component';
import { RatedEntityPreviewCardTableRowComponent } from './components/rated-entity-preview-card/rated-entity-preview-card-table/rated-entity-preview-card-table-row/rated-entity-preview-card-table-row.component';
import { RatedEntityPreviewCardTableColumnComponent } from './components/rated-entity-preview-card/rated-entity-preview-card-table/rated-entity-preview-card-table-column/rated-entity-preview-card-table-column.component';
import { AdvertisementResponseComponent } from './components/advertisement/advertisement-response/advertisement-response.component';
import { ListedItemsTableComponent } from './components/advertisement/listed-items-table/listed-items-table.component';
import { ListedItemEditDialogComponent } from './components/advertisement/listed-item-edit-dialog/listed-item-edit-dialog.component';
import { MultilingualTextInputComponent } from './form-controls/common/multilingual-text-input/multilingual-text-input.component';


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
    MultilingualTextTranslatePipe,
    ProjectDetailIntroComponent,
    PageSidenavComponent,
    ProjectImportantInformationComponent,
    ProjectComponent,
    HelpListComponent,
    AdvertisementDetailComponent,
    ForbiddenComponent,
    ErrorComponent,
    InternalServerErrorComponent,
    Error4xxComponent,
    Error5xxComponent,
    MultilingualTextToCurrentLanguagePipe,
    ListedItemInfoDialogComponent,
    UserWithReviewComponent,
    RatedEntityPreviewCardComponent,
    RatedEntityPreviewCardTableComponent,
    RatedEntityPreviewCardTableRowComponent,
    RatedEntityPreviewCardTableColumnComponent,
    AdvertisementResponseComponent,
    ListedItemsTableComponent,
    ListedItemEditDialogComponent,
    MultilingualTextInputComponent,
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
    ShareModule,
    GalleryModule,
    MatDividerModule,
    MatTableModule,
    MatRippleModule,
    MatDialogModule,
    MatSortModule,
    BarRatingModule,
    MatCardModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: cs},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
