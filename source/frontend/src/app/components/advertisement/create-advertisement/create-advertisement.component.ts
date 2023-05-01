import {Component, OnInit} from '@angular/core';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {ReadOnlyLanguage} from "../../../models/common/language";
import {LanguageService} from "../../../services/language.service";
import {
  CreateAdvertisementContactFormResult
} from "./create-advertisement-contact-form/create-advertisement-contact-form.component";
import {requireDefinedNotNull} from "../../../shared/assertions/object-assertions";
import {
  CreateAdvertisementInfoFormResult
} from "./create-advertisement-info-form.component.ts/create-advertisement-info-form.component";
import {NotificationService} from "../../../services/notification.service";
import {AddressDetailLevel} from "../../../form-controls/common/address-input/address-input.component";
import {AdvertisementItem} from "../../../models/advertisement/advertisement-item";
import {AdvertisementHelpType} from "../../../models/advertisement/advertisement-help-type";
import {Nullable} from "../../../shared/types/common";
import {CatastropheTypeAndProjectStatus} from "../../../models/projects/project";
import {ProjectService} from "../../../services/project.service";
import {combineLatest, filter, first, mergeMap, Observable} from "rxjs";
import {Router} from "@angular/router";
import {isObjectNotNullOrUndefined, isObjectNullOrUndefined} from "../../../shared/predicates/object-predicates";
import {universalHttpErrorResponseHandler} from "../../../shared/utils/error-handling-functions";
import {CatastropheType} from "../../../models/projects/catastrophe-type";
import {AdvertisementService} from "../../../services/advertisement.service";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../../services/user.service";

@UntilDestroy()
@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.scss'],
})
export class CreateAdvertisementComponent implements OnInit {

  catastropheTypeAndProjectStatus?: CatastropheTypeAndProjectStatus

  get catastropheType(): CatastropheType | undefined {
    return this.catastropheTypeAndProjectStatus?.catastropheType
  }

  advertisementType: AdvertisementType = AdvertisementType.OFFER

  advertisementHelpType: Nullable<AdvertisementHelpType> = null;

  defaultLanguage: ReadOnlyLanguage;

  private _isUserLoggedIn: boolean = false

  public get isUserLoggedIn() {
    return this._isUserLoggedIn
  }

  _locationForm?: FormGroup;

  protected get locationForm(): FormGroup {
    return requireDefinedNotNull(this._locationForm)
  }

  _advertisementInfoForm?: FormGroup;

  protected get advertisementInfoForm(): FormGroup {
    return requireDefinedNotNull(this._advertisementInfoForm)
  }

  constructor(private fb: FormBuilder,
              protected languageService: LanguageService,
              protected projectService: ProjectService,
              protected advertisementService: AdvertisementService,
              protected notificationService: NotificationService,
              protected router: Router,
              protected userService: UserService) {
    this.defaultLanguage = languageService.instantLanguage
  }

  private getCurrentProjectCatastropheTypeAndProjectStatus$(): Observable<CatastropheTypeAndProjectStatus> {
    return this.projectService.getCurrentProjectCatastropheTypeAndProjectStatus$()
      .pipe(
        //TODO: When project is not required to create advertisement,
        // this will cause application to hang. Other kind of logic will be required in that case
        //Right now the logic is taking advantage of the fact,
        // that the component is only accessible using route with project selected
        filter(isObjectNotNullOrUndefined),
        first(),
      )
  }

  private getLoggedUserDetail$() {
    return this.userService.isUserLoggedIn$()
  }

  ngOnInit(): void {
    combineLatest([
      this.getCurrentProjectCatastropheTypeAndProjectStatus$(),
      this.getLoggedUserDetail$()
    ]).pipe(untilDestroyed(this))
      .subscribe({
        next: ([catastropheTypeAndProjectStatus, isUserLoggedIn]) => {
          this.catastropheTypeAndProjectStatus = catastropheTypeAndProjectStatus
          this._isUserLoggedIn = isUserLoggedIn
        }
      })
    this._advertisementInfoForm = this.fb.group({})
    this._locationForm = this.fb.group({})
  }


  onTypeChanged(type: AdvertisementType) {
    this.advertisementType = type
  }

  onHelpTypeChanged(type: AdvertisementHelpType) {
    this.advertisementHelpType = type
  }

  onDefaultLanguageChange(lang: ReadOnlyLanguage) {
    console.log('Default lang set to: ', lang)
    this.defaultLanguage = lang
  }

  private validateData(advertisementInfoFormResult: CreateAdvertisementInfoFormResult,
                       locationForm: FormGroup,
                       contactFormResult: Nullable<CreateAdvertisementContactFormResult>): boolean {
    //When user is logged in, no data are expected and when user isn't logged in, contact is required
    const contactFormInvalid =
      (!this.isUserLoggedIn || isObjectNotNullOrUndefined(contactFormResult))
      &&
      (this.isUserLoggedIn || !contactFormResult?.isValid)
    if (!advertisementInfoFormResult.isValid) {
      this.notificationService.failure(
        'CREATE_ADVERTISEMENT.SUBMIT_ERRORS.ADVERTISEMENT_INFO_FORM_INVALID',
        true
      )
    }
    if (contactFormInvalid) {
      this.notificationService.failure('CREATE_ADVERTISEMENT.SUBMIT_ERRORS.CONTACT_FORM_INVALID', true)
    }
    if (locationForm.invalid) {
      this.notificationService.failure(
        'CREATE_ADVERTISEMENT.SUBMIT_ERRORS.LOCATION_FORM_INVALID',
        true
      )
    }

    return !contactFormInvalid && advertisementInfoFormResult.isValid && locationForm.valid
  }

  submit(advertisementInfoFormResult: CreateAdvertisementInfoFormResult,
         listedItems: AdvertisementItem[],
         locationForm: FormGroup,
         contactFormResult: Nullable<CreateAdvertisementContactFormResult>) {
    const valid = this.validateData(advertisementInfoFormResult, locationForm, contactFormResult)
    if (valid) {
      this.notificationService.startLoading("CREATE_ADVERTISEMENT.SUBMITTING", true)
      this.advertisementService.create({
        title: advertisementInfoFormResult.advertisementInfo.title,
        description: advertisementInfoFormResult.advertisementInfo.description,
        location: locationForm.value.address,
        nonRegisteredUserInfoCreationData: isObjectNullOrUndefined(contactFormResult) ? undefined : {
          contact: requireDefinedNotNull(contactFormResult.contact),
          spokenLanguages: requireDefinedNotNull(contactFormResult.spokenLanguages),
          publishedContactDetail: requireDefinedNotNull(contactFormResult.publishedContactDetailsSettings)
        },
        projectSlug: requireDefinedNotNull(this.projectService.currentProjectSlugInstant),
        type: advertisementInfoFormResult.advertisementInfo.type,
        helpType: advertisementInfoFormResult.advertisementInfo.helpType,
        items: listedItems
      })
        .pipe(mergeMap(() => this.projectService.routeRelativeToCurrentProject$("/help-list")))
        .subscribe({
          next: (helpListLink) => {
            this.notificationService.stopLoading()
            this.notificationService.success("CREATE_ADVERTISEMENT.SUCCESS", true)
            this.router.navigate([helpListLink])
          },
          error: (err) => {
            console.dir(err)
            this.notificationService.stopLoading()
            if (err instanceof HttpErrorResponse) {
              universalHttpErrorResponseHandler(err, this.router)
            } else {
              this.notificationService.failure("UNKNOWN_ERROR", true)
            }
          }
        })
    }
  }

  get locationMinDetailLevel(): AddressDetailLevel {
    return AddressDetailLevel.COUNTRY
  }

  get locationMaxDetailLevel(): AddressDetailLevel {
    return AddressDetailLevel.STREET
  }
}
