import {Component} from '@angular/core';
import {UntilDestroy} from "@ngneat/until-destroy";
import {AbstractControl} from "@angular/forms";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {ReadOnlyLanguage} from "../../../models/common/language";
import {LanguageService} from "../../../services/language.service";

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

  constructor(protected languageService: LanguageService) {
    this.defaultLanguage = languageService.instantLanguage
  }

  onTypeChanged(type: AdvertisementType) {
    this.advertisementType = type
  }

  onDefaultLanguageChange(lang: ReadOnlyLanguage) {
    console.log('Default lang set to: ', lang)
    this.defaultLanguage = lang
  }
}
