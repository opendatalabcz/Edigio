import { Component } from '@angular/core';
import {AdvertisementTemplate} from "../../../models/advertisement/advertisement-template";
import {AdvertisementTemplateService} from "../../../services/advertisement-template.service";
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject, first, map, Observable, of, tap} from "rxjs";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {Nullable} from "../../../utils/types/common";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.scss']
})
export class CreateAdvertisementComponent {

  templates: Observable<AdvertisementTemplate[]> = of([])

  templatesLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  templateToString = (template: AdvertisementTemplate) => {
    return this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(template.name)
  }

  constructor(private advertisementTemplateService: AdvertisementTemplateService,
              private translateService: TranslateService,
              private multilingualTextService: MultilingualTextService,
              private notificationService: NotificationService) {
  }


  selectTemplate(template: AdvertisementTemplate) {
    this.multilingualTextService.toLocalizedTextForCurrentLanguage$(template.name)
      .pipe(first())
      .subscribe(translation => {
        this.notificationService.success(
          "CREATE_ADVERTISEMENT.TEMPLATES.SUCCESSFULLY_APPLIED",
          true,
          {templateName: translation.text}
        )
      })
  }

  onNameFilterChange(nameFilter: string) {
    console.log('called')
    this.templatesLoading$.next(true)
    this.advertisementTemplateService.findTemplatesByFilter({
      name: {lang: this.translateService.currentLang, text: nameFilter}
    }).pipe(
      tap(() => this.templatesLoading$.next(false))
    )
  }
}
