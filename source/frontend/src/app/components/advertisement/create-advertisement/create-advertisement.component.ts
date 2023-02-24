import {Component} from '@angular/core';
import {AdvertisementTemplate} from "../../../models/advertisement/advertisement-template";
import {AdvertisementTemplateService} from "../../../services/advertisement-template.service";
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject, Observable} from "rxjs";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {NotificationService} from "../../../services/notification.service";
import {UntilDestroy} from "@ngneat/until-destroy";
import {AdvertisementTemplateFilter} from "../../../models/advertisement/advertisement-template-filter";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {AdvertisedItem, AdvertisementType} from "../../../models/advertisement/advertisement";
import {requireValidAdvertisementType} from "../../../utils/assertions/advertisement-assertions";
import {ProjectService} from "../../../services/project.service";
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

@UntilDestroy(this)
@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.scss']
})
export class CreateAdvertisementComponent {

  advertisementType: AdvertisementType = AdvertisementType.OFFER

  onTypeChanged(type: AdvertisementType) {
    this.advertisementType = type
  }
}
