import {Component, OnInit} from '@angular/core';
import {AdvertisementTemplate} from "../../../models/advertisement/advertisement-template";
import {AdvertisementTemplateService} from "../../../services/advertisement-template.service";
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject, first, mergeMap, Observable, of, tap} from "rxjs";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {NotificationService} from "../../../services/notification.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AdvertisementTemplateFilter} from "../../../models/advertisement/advertisement-template-filter";

@UntilDestroy(this)
@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.scss']
})
export class CreateAdvertisementComponent implements OnInit {

  templates$: BehaviorSubject<AdvertisementTemplate[]> = new BehaviorSubject<AdvertisementTemplate[]>([])

  templatesLoading = false;

  private templatesFilter$: BehaviorSubject<AdvertisementTemplateFilter>;
  templateToString = (template: AdvertisementTemplate) => {
    return this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(template.name)
  }

  constructor(private advertisementTemplateService: AdvertisementTemplateService,
              private translateService: TranslateService,
              private multilingualTextService: MultilingualTextService,
              private notificationService: NotificationService) {
    this.templatesFilter$ = new BehaviorSubject<AdvertisementTemplateFilter>({})
  }

  ngOnInit() {
    this.templatesFilter$
      .pipe(
        tap(() => this.templatesLoading = true),
        untilDestroyed(this),
        mergeMap((updatedFilter) => this.advertisementTemplateService.findTemplatesByFilter(updatedFilter)),
        tap(() => this.templatesLoading = false)
      )
      .subscribe((templates) => this.templates$.next(templates))
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
    this.templatesFilter$.next(
      {
        ...this.templatesFilter$.value,
        name: this.multilingualTextService.createLocalizedTextForCurrentLang(nameFilter)
      })
  }
}
