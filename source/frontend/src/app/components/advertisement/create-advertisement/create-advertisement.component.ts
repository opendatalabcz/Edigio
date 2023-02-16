import { Component } from '@angular/core';
import {AdvertisementTemplate} from "../../../models/advertisement/advertisement-template";
import {AdvertisementTemplateService} from "../../../services/advertisement-template.service";
import {TranslateService} from "@ngx-translate/core";
import {map, Observable, of} from "rxjs";
import {MultilingualTextService} from "../../../services/multilingual-text.service";

@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.scss']
})
export class CreateAdvertisementComponent {

  templates: Observable<AdvertisementTemplate[]> = of([])

  templateToString = (template: AdvertisementTemplate) => {
    return this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(template.name)
  }

  constructor(private advertisementTemplateService: AdvertisementTemplateService,
              private translateService: TranslateService,
              private multilingualTextService: MultilingualTextService) {
  }

  //TODO: Change any for AdvertisementTemplate type!
  selectTemplate(template: AdvertisementTemplate) {

  }

  onNameFilterChange(nameFilter: string) {
    this.templates = this.advertisementTemplateService.findTemplatesByFilter({
      name: {lang: this.translateService.currentLang, text: nameFilter}
    })
  }
}
