import {Component, OnInit} from '@angular/core';
import {UntilDestroy} from "@ngneat/until-destroy";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {ReadOnlyLanguage} from "../../../models/common/language";
import {LanguageService} from "../../../services/language.service";
import {
  CreateAdvertisementContactFormResult
} from "./create-advertisement-contact-form/create-advertisement-contact-form.component";
import {requireDefinedNotNull} from "../../../utils/assertions/object-assertions";
import {
  CreateAdvertisementInfoFormResult
} from "./create-advertisement-info-form.component.ts/create-advertisement-info-form.component";
import {NotificationService} from "../../../services/notification.service";
import {AddressDetailLevel} from "../../../form-controls/common/address-input/address-input.component";
import {AdvertisementItem} from "../../../models/advertisement/advertisement-item";
import {AdvertisementHelpType} from "../../../models/advertisement/advertisement-help-type";
import {Nullable} from "../../../utils/types/common";
import {CatastropheTypeAndProjectStatus} from "../../../models/projects/project";
import {ProjectService} from "../../../services/project.service";
import {map, tap} from "rxjs";
import {Router} from "@angular/router";
import {isObjectNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {universalHttpErrorResponseHandler} from "../../../utils/error-handling-functions";
import {CatastropheType} from "../../../models/projects/catastrophe-type";
import {AdvertisementService} from "../../../services/advertisement.service";
import {HttpErrorResponse} from "@angular/common/http";

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
              protected router: Router) {
    this.defaultLanguage = languageService.instantLanguage
    this.projectService.getCurrentProjectCatastropheTypeAndProjectStatus$()
      .pipe(
        tap((result) => {
          if (isObjectNullOrUndefined(result)) {
            this.router.navigate(["/not-found"])
          }
        }))
      .subscribe({
        next: (catastropheTypeAndProjectStatus) => {
          this.catastropheTypeAndProjectStatus = catastropheTypeAndProjectStatus
        },
        error: (err) => universalHttpErrorResponseHandler(err, this.router)
      })
  }

  ngOnInit(): void {
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
                       contactFormResult: CreateAdvertisementContactFormResult): boolean {
    if (!advertisementInfoFormResult.isValid) {
      this.notificationService.failure(
        'CREATE_ADVERTISEMENT.SUBMIT_ERRORS.ADVERTISEMENT_INFO_FORM_INVALID',
        true
      )
    }
    if (!contactFormResult.isValid) {
      this.notificationService.failure('CREATE_ADVERTISEMENT.SUBMIT_ERRORS.CONTACT_FORM_INVALID', true)
    }
    if (locationForm.invalid) {
      this.notificationService.failure(
        'CREATE_ADVERTISEMENT.SUBMIT_ERRORS.LOCATION_FORM_INVALID',
        true
      )
    }

    return contactFormResult.isValid && advertisementInfoFormResult.isValid
  }

  submit(advertisementInfoFormResult: CreateAdvertisementInfoFormResult,
         listedItems: AdvertisementItem[],
         locationForm: FormGroup,
         contactFormResult: CreateAdvertisementContactFormResult,) {
    const valid = this.validateData(advertisementInfoFormResult, locationForm, contactFormResult)
    console.log('Advertised info: ', advertisementInfoFormResult)
    console.log('listedItems: ', listedItems)
    console.log('Location form: ', locationForm)
    console.log('Contact form result: ', contactFormResult)
    if (valid) {
      this.notificationService.startLoading("CREATE_ADVERTISEMENT.SUBMITTING")
      this.advertisementService.create({
        title: advertisementInfoFormResult.advertisementInfo.title,
        description: advertisementInfoFormResult.advertisementInfo.description,
        location: locationForm.value.address,
        anonymousUserInfoCreationData: {
          contact: requireDefinedNotNull(contactFormResult.contact),
          spokenLanguages: requireDefinedNotNull(contactFormResult.spokenLanguages),
          publishedContactDetail: requireDefinedNotNull(contactFormResult.publishedContactDetailsSettings)
        },
        projectSlug: requireDefinedNotNull(this.projectService.currentProjectSlugInstant),
        type: advertisementInfoFormResult.advertisementInfo.type,
        helpType: advertisementInfoFormResult.advertisementInfo.helpType,
        items: listedItems
      })
        .pipe(map(slug => this.advertisementService.getAdvertisementDetailsLinkForCurrentProject$(slug)))
        .subscribe({
          next: (detailsLink) => {
            this.notificationService.stopLoading()
            this.notificationService.success("CREATE_ADVERTISEMENT.SUCCESS", true)
            this.router.navigate([detailsLink])
          },
          error: (err) => {
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
