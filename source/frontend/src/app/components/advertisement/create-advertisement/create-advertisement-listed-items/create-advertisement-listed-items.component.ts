import {Component, Input} from '@angular/core';
import {AdvertisementTemplate} from "../../../../models/advertisement/advertisement-template";
import {BehaviorSubject, first, mergeMap, tap} from "rxjs";
import {MultilingualTextService} from "../../../../services/multilingual-text.service";
import {NotificationService} from "../../../../services/notification.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AdvertisementTemplateFilter} from "../../../../models/advertisement/advertisement-template-filter";
import {ProjectService} from "../../../../services/project.service";
import {AdvertisementTemplateService} from "../../../../services/advertisement-template.service";
import {AdvertisedItem, AdvertisementType} from "../../../../models/advertisement/advertisement";

@UntilDestroy()
@Component({
  selector: 'app-create-advertisement-listed-items',
  templateUrl: './create-advertisement-listed-items.component.html',
  styleUrls: ['./create-advertisement-listed-items.component.scss']
})
export class CreateAdvertisementListedItemsComponent {
  templates$: BehaviorSubject<AdvertisementTemplate[]> = new BehaviorSubject<AdvertisementTemplate[]>([])
  templatesLoading = false;
  _advertisementType: AdvertisementType = AdvertisementType.OFFER
  public hasError: boolean = true

  private templatesFilter$ = new BehaviorSubject<AdvertisementTemplateFilter>({})

  @Input() set advertisementType(advertisementType: AdvertisementType) {
    this._advertisementType = advertisementType
    this.templatesFilter$.next({...this.templatesFilter$.value, advertisementTypes: [advertisementType]})
  }

  get advertisementType() : AdvertisementType {
    return this._advertisementType
  }
  constructor(private multilingualTextService: MultilingualTextService,
              private notificationService: NotificationService,
              private projectService: ProjectService,
              private advertisementTemplateService: AdvertisementTemplateService) {
    this.initTemplateFilterChangeSubscription()
    this.initCatastropheTypeSubscription()
  }

  private initTemplateFilterChangeSubscription() {
    this.templatesFilter$
      .pipe(
        tap(() => this.templatesLoading = true),
        untilDestroyed(this),
        mergeMap((updatedFilter) => this.advertisementTemplateService.findTemplatesByFilter(updatedFilter)),
        tap(() => this.templatesLoading = false)
      )
      .subscribe((templates) => this.templates$.next(templates))
  }

  private initCatastropheTypeSubscription() {
    this.projectService.currentProjectCatastropheType$()
      .pipe(untilDestroyed(this))
      .subscribe(catastropheType => this.templatesFilter$.next({
        ...this.templatesFilter$.value,
        catastropheTypes: catastropheType ? [catastropheType] : []
      }))
  }

  selectTemplate(template: AdvertisementTemplate) {
    console.dir(template)
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

  templateToString = (template: AdvertisementTemplate) => {
    return this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(template.name)
  }

  onEdit(advertisedItem: AdvertisedItem) {
    //TODO: Implement editation of listed itme
  }

  onDelete(advertisedItem: AdvertisedItem) {
    //TODO: Implement delete of listed item
  }

  onAdd() {

  }
}
