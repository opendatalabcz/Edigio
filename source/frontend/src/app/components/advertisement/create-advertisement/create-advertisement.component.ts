import {Component, OnInit} from '@angular/core';
import {UntilDestroy} from "@ngneat/until-destroy";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AdvertisementInfo, AdvertisementType} from "../../../models/advertisement/advertisement";
import {ReadOnlyLanguage} from "../../../models/common/language";
import {LanguageService} from "../../../services/language.service";
import {
  CreateAdvertisementContactFormResult
} from "./create-advertisement-contact-form/create-advertisement-contact-form.component";
import {requireDefinedNotNull, requireNotNull} from "../../../utils/assertions/object-assertions";
import {Contact} from "../../../models/common/contact";
import {
  CreateAdvertisementInfoFormResult
} from "./create-advertisement-info-form.component.ts/create-advertisement-info-form.component";
import {NotificationService} from "../../../services/notification.service";
import {
  AddressDetailLevel,
  AddressInputComponent
} from "../../../form-controls/common/address-input/address-input.component";
import {Address} from "../../../models/common/address";
import {AdvertisedItem} from "../../../models/advertisement/advertised-item";
import {ListedItem} from "../../../models/advertisement/resource";

@UntilDestroy()
@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.scss'],
})
export class CreateAdvertisementComponent implements OnInit {

  advertisementType: AdvertisementType = AdvertisementType.OFFER

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
              protected notificationService: NotificationService) {
    this.defaultLanguage = languageService.instantLanguage
  }

  ngOnInit(): void {
    this._advertisementInfoForm = this.fb.group({})
    this._locationForm = this.fb.group({})
  }


  onTypeChanged(type: AdvertisementType) {
    this.advertisementType = type
  }

  onDefaultLanguageChange(lang: ReadOnlyLanguage) {
    console.log('Default lang set to: ', lang)
    this.defaultLanguage = lang
  }

  private validateData(advertisementInfoFormResult: CreateAdvertisementInfoFormResult,
                       listedItems: ListedItem[],
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
    if(!locationForm.invalid) {
      this.notificationService.failure(
        'CREATE_ADVERTISEMENT.SUBMIT_ERRORS.LOCATION_FORM_INVALID',
        true
      )
    }

    return contactFormResult.isValid && advertisementInfoFormResult.isValid
  }

  submit(advertisementInfoFormResult: CreateAdvertisementInfoFormResult,
         listedItems: AdvertisedItem[],
         locationForm: FormGroup,
         contactFormResult: CreateAdvertisementContactFormResult,) {
    const valid = this.validateData(advertisementInfoFormResult, listedItems, locationForm, contactFormResult)
    console.log('Advertised info: ', advertisementInfoFormResult)
    console.log('listedItems: ', listedItems)
    console.log('Location form: ', locationForm)
    console.log('Contact form result: ', contactFormResult)
    if (valid) {
      //TODO: Implement data processing
    }
  }

  get locationMinDetailLevel(): AddressDetailLevel {
    return AddressDetailLevel.COUNTRY
  }

  get locationMaxDetailLevel(): AddressDetailLevel {
    return AddressDetailLevel.STREET
  }
}
