import {Component} from '@angular/core';
import {UntilDestroy} from "@ngneat/until-destroy";
import {AbstractControl, FormGroup} from "@angular/forms";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {ReadOnlyLanguage} from "../../../models/common/language";
import {LanguageService} from "../../../services/language.service";
import {
  CreateAdvertisementContactFormResult
} from "./create-advertisement-contact-form/create-advertisement-contact-form.component";
import {ContactFormData} from "../../../models/common/contact-form-data";
import {requireNotNull} from "../../../utils/assertions/object-assertions";
import {Contact} from "../../../models/common/contact";
import {
  CreateAdvertisementInfoFormResult
} from "./create-advertisement-info-form.component.ts/create-advertisement-info-form.component";
import {Nullable} from "../../../utils/types/common";
import {isArrayNullUndefinedOrEmpty} from "../../../utils/array-utils";
import {translate} from "@angular/localize/tools";
import {NotificationService} from "../../../services/notification.service";

interface CreateAdvertisementFormControls {
  advertisementType: AbstractControl<AdvertisementType, AdvertisementType>
  advertisementTitle: AbstractControl<string, string>,
  advertisementDescription: AbstractControl<string, string>
  primaryLanguage: AbstractControl<string, string>,
  currentLanguage: AbstractControl<ReadOnlyLanguage, ReadOnlyLanguage>
}

type CreateAdvertisementFormStep = 'LISTED_ITEMS' | 'ADVERTISEMENT_DETAILS'

@UntilDestroy()
@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.scss'],
})
export class CreateAdvertisementComponent {

  advertisementType: AdvertisementType = AdvertisementType.OFFER

  defaultLanguage: ReadOnlyLanguage;

  constructor(protected languageService: LanguageService,
              protected notificationService: NotificationService) {
    this.defaultLanguage = languageService.instantLanguage
  }

  onTypeChanged(type: AdvertisementType) {
    this.advertisementType = type
  }

  onDefaultLanguageChange(lang: ReadOnlyLanguage) {
    console.log('Default lang set to: ', lang)
    this.defaultLanguage = lang
  }

  private validateData(contactFormResult: CreateAdvertisementContactFormResult) : boolean  {
    const contactFormValid = contactFormResult.isValid
    if(!contactFormValid) {
      this.notificationService.failure('CREATE_ADVERTISEMENT.SUBMIT_ERRORS.CONTACT_FORM_INVALID', true)
    }
    return true
  }

  private processResultsData(contact: Contact) {

  }

  submit(advertisementInfoFormResult: CreateAdvertisementInfoFormResult,
         contactFormResult: CreateAdvertisementContactFormResult) {
    const invalid = this.validateData(contactFormResult)
    if(invalid) {
      this.processResultsData(
        requireNotNull(contactFormResult.contact, 'Invalid state (null data, valid form result)!')
      )
    }
  }
}
