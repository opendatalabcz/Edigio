import {Component, Input} from '@angular/core';
import {AdvertisementTemplate} from "../../../../models/advertisement/advertisement-template";
import {BehaviorSubject, first, map, mergeMap, tap} from "rxjs";
import {MultilingualTextService} from "../../../../services/multilingual-text.service";
import {NotificationService} from "../../../../services/notification.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AdvertisementTemplateFilter} from "../../../../models/advertisement/advertisement-template-filter";
import {ProjectService} from "../../../../services/project.service";
import {AdvertisementTemplateService} from "../../../../services/advertisement-template.service";
import {AdvertisedItem, AdvertisementType, ResponseItem} from "../../../../models/advertisement/advertisement";
import {ResourceShort} from "../../../../models/advertisement/resource";
import {v4 as uuidv4} from "uuid";
import {MatDialog} from "@angular/material/dialog";
import {ResponseItemEditDialogComponent} from "../../response-item-edit-dialog/response-item-edit-dialog.component";
import {DialogResults} from "../../../../models/common/dialogResults";
import {ReadOnlyLanguage} from "../../../../models/common/language";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";

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

  listedItems$: BehaviorSubject<AdvertisedItem[]> = new BehaviorSubject<AdvertisedItem[]>([])

  get advertisementType(): AdvertisementType {
    return this._advertisementType
  }

  private _defaultLanguage?: ReadOnlyLanguage;

  @Input() set defaultLanguage(language: ReadOnlyLanguage) {
    this._defaultLanguage = language
  }

  get defaultLanguage(): ReadOnlyLanguage {
    return requireDefinedNotNull(this._defaultLanguage, 'Default language for listed items not set!')
  }

  constructor(private multilingualTextService: MultilingualTextService,
              private notificationService: NotificationService,
              private projectService: ProjectService,
              private advertisementTemplateService: AdvertisementTemplateService,
              private matDialog: MatDialog) {
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

  private resourcesToAdvertismentItems(resources: ResourceShort[]): AdvertisedItem[] {
    return resources.map((res) => ({
      id: uuidv4(),
      resource: res,
      amount: 1,
    }))
  }

  selectTemplate(template: AdvertisementTemplate) {
    this.advertisementTemplateService.getResourcesForTemplate(template)
      .pipe(
        map((resources) => this.resourcesToAdvertismentItems(resources)),
        untilDestroyed(this)
      )
      .subscribe((resources) => {
        console.dir("Mapped:", resources)
        this.listedItems$.next(resources)
        console.dir("Value:", this.listedItems$.value)
      })
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
    this.matDialog
      .open(ResponseItemEditDialogComponent,
        {data: {item: {...advertisedItem}, advertisementType: this.advertisementType}}
      )
      .afterClosed()
      .subscribe((dialogResult: { result: DialogResults, data?: ResponseItem }) => {
        if (!dialogResult || dialogResult.result === DialogResults.FAILURE) {
          this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.EDIT_NOT_SUCCESSFUL", true)
          return;
        }
        const updatedItem = dialogResult?.data
        if (dialogResult.result === DialogResults.SUCCESS && updatedItem) {

        }
      })
  }

  onDelete(itemToDelete: AdvertisedItem) {
    this.notificationService.confirm(
      //TODO: Replace messages with something that makes sense and is localized
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.TITLE",
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.MESSAGE",
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.OK_BUTTON",
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.CANCEL_BUTTON",
      true,
      () => {
        this.listedItems$.next(
          this.listedItems$.value.filter(advertisedItem => advertisedItem.id !== itemToDelete.id)
        )
      }
    )
  }

  onAdd() {

  }

  showListedItemDetail(item: AdvertisedItem) {
    console.log(item)
  }
}
