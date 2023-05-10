import {Component, Input} from '@angular/core';
import {AdvertisementTemplateShort} from "../../../../models/advertisement/advertisement-template";
import {BehaviorSubject, distinctUntilChanged, filter, first, map, mergeMap, Observable, startWith, tap} from "rxjs";
import {MultilingualTextService} from "../../../../services/multilingual-text.service";
import {NotificationService} from "../../../../services/notification.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AdvertisementTemplateFilter} from "../../../../models/advertisement/advertisement-template-filter";
import {ProjectService} from "../../../../services/project.service";
import {AdvertisementTemplateService} from "../../../../services/advertisement-template.service";
import {AdvertisementType} from "../../../../models/advertisement/advertisement";
import {ResourceShort} from "../../../../models/advertisement/resource";
import {v4 as uuidv4} from "uuid";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogResult, DialogResults} from "../../../../models/common/dialogResults";
import {ReadOnlyLanguage} from "../../../../models/common/language";
import {requireDefinedNotNull} from "../../../../shared/assertions/object-assertions";
import {Nullable} from "../../../../shared/types/common";
import {isDefinedNotEmpty} from "../../../../shared/predicates/string-predicates";
import {anyMatch} from "../../../../shared/utils/array-utils";
import {Page, PageInfo} from "../../../../models/pagination/page";
import {extractPageInfo, pageFromItems} from "../../../../shared/utils/page-utils";
import {
  AdvertisedItemEditDialogComponent,
  AdvertisedItemEditDialogData
} from "../../advertised-item-edit-dialog/advertised-item-edit-dialog.component";
import {MultilingualText} from "../../../../models/common/multilingual-text";
import {
  AdvertisedItemInfoDialogComponent
} from "../../advertised-item-info-dialog/advertised-item-info-dialog.component";
import {AdvertisementItem} from "../../../../models/advertisement/advertisement-item";
import {
  AdvertisementTemplateConfirmApplyDialogComponent
} from "../../advertisement-template-confirm-apply-dialog/advertisement-template-confirm-apply-dialog.component";
import {AdvertisementHelpType} from "../../../../models/advertisement/advertisement-help-type";
import {CatastropheType} from "../../../../models/projects/catastrophe-type";
import {PageRequest} from "../../../../models/pagination/page-request";

@UntilDestroy()
@Component({
  selector: 'app-create-advertisement-listed-items',
  templateUrl: './create-advertisement-listed-items.component.html',
  styleUrls: ['./create-advertisement-listed-items.component.scss']
})
export class CreateAdvertisementListedItemsComponent {
  /**
   * Loaded templates matching giving filter
   */
  templates$: BehaviorSubject<AdvertisementTemplateShort[]> = new BehaviorSubject<AdvertisementTemplateShort[]>([])
  /**
   * Indicator whether templates are loading
   */
  templatesLoading = false;
  /**
   * Type of advertisement
   */
  _advertisementType: AdvertisementType = AdvertisementType.OFFER

  /**
   * Currently used filter of templates
   * @private
   */
  private templatesFilter$ = new BehaviorSubject<AdvertisementTemplateFilter>({})

  private advertisementTypeSet: boolean = false

  /**
   * Set advertisement type, and also update template filter with new type
   * @param advertisementType type to be set
   */
  @Input() set advertisementType(advertisementType: AdvertisementType) {
    this._advertisementType = advertisementType
    this.advertisementTypeSet = true
    this.templatesFilter$.next({
      ...this.templatesFilter$.value,
      advertisementTypes: [advertisementType]
    })
  }

  private advertisementHelpTypeSet: boolean = false

  private _advertisementHelpType: Nullable<AdvertisementHelpType> = null

  @Input() set advertisementHelpType(helpType: Nullable<AdvertisementHelpType>) {
    this._advertisementHelpType = helpType
    this.advertisementHelpTypeSet = helpType != null
    this.templatesFilter$.next({
      ...this.templatesFilter$.value,
      advertisementHelpTypes: helpType ? [helpType] : undefined
    })
  }

  private catastropheTypeSet: boolean = false

  private _catastropheType?: CatastropheType

  @Input() set catastropheType(catastropheType: CatastropheType | undefined) {
    this._catastropheType = catastropheType
    this.catastropheTypeSet = catastropheType !== undefined
    this.templatesFilter$.next({
      ...this.templatesFilter$.value,
      catastropheTypes: catastropheType ? [catastropheType] : undefined
    })
  }

  /**
   * All items listed in advertisement
   */
  listedItems$: BehaviorSubject<AdvertisementItem[]> = new BehaviorSubject<AdvertisementItem[]>([])

  get instantListedItems(): AdvertisementItem[] {
    return this.listedItems$.value
  }

  /**
   * Currently displayed page of listed items in table
   */
  listedItemsPage$: BehaviorSubject<Page<AdvertisementItem>> = new BehaviorSubject<Page<AdvertisementItem>>(
    pageFromItems([], {idx: 0, size: 5})
  )

  /**
   * Observable of items available in listed items array
   */
  get listedItemsPageItems$(): Observable<AdvertisementItem[]> {
    return this.listedItemsPage$.pipe(map((page) => page.items))
  }

  /**
   * Observable info about current page
   */
  get currentPageInfo$(): Observable<PageInfo> {
    //Could probably simply use page as it's also page info, but I wanted to make sure it won't be change outside
    return this.listedItemsPage$
      .pipe(
        startWith(this.listedItemsPage$.value),
        map(page => extractPageInfo(page))
      )
  }

  get advertisementType(): AdvertisementType {
    return this._advertisementType
  }

  /**
   * Default language of advertisement
   * @private
   */
  private _defaultLanguage?: ReadOnlyLanguage;

  /**
   * Default language of advertisement
   *
   * <p>Sets default language of all listed items.
   * When text in the language is an item, it's value is set to empty text
   * ({@see MultilingualText#setDefaultLanguage}) for additional info
   * </p>
   *
   * @param language
   */
  @Input() set defaultLanguage(language: ReadOnlyLanguage) {
    this._defaultLanguage = language
    this.instantListedItems.forEach(item => {
      item.description?.setDefaultLanguage(language.code, true, true)
    })
    //Advertise listeners that items might have changed
    this.listedItems$.next(this.instantListedItems)
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
    this.initListedItemsUpdate()
  }

  private initTemplateFilterChangeSubscription() {

    this.templatesFilter$
      .pipe(
        //Make sure not to send redundant requests during initial configuration
        filter(() => this.advertisementTypeSet && this.advertisementHelpTypeSet && this.catastropheTypeSet),
        distinctUntilChanged((previous, current) => previous.name?.text === current.name?.text),
        tap(() => this.templatesLoading = true),
        untilDestroyed(this),
        mergeMap((updatedFilter) => {
          return this.advertisementTemplateService.findTopNTemplatesByFilter(updatedFilter, 10)
        }),
        tap(() => this.templatesLoading = false)
      )
      .subscribe((templates) => this.templates$.next(templates))
  }

  private lastPageRequest: PageRequest = {idx: 0, size: 5}

  private refreshItemsPage() {
    const updatedPage = pageFromItems(
      this.instantListedItems,
      this.lastPageRequest
    )
    this.listedItemsPage$.next(updatedPage)
  }

  private initListedItemsUpdate() {
    this.listedItems$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.refreshItemsPage()
      })
  }

  private resourcesToAdvertismentItems(resources: ResourceShort[]): AdvertisementItem[] {
    return resources.map((res) => ({
      id: uuidv4(),
      description: MultilingualText.of({languageCode: this.defaultLanguage.code, text: ''}),
      resource: res,
      amount: 1,
    }))
  }

  private applyTemplateResources(items: AdvertisementItem[]) {
    this.listedItems$.next(items)
    this.notificationService.success(
      "CREATE_ADVERTISEMENT.TEMPLATES.SUCCESSFULLY_APPLIED",
      true
    )
  }

  private cancelTemplateApply() {
    this.notificationService.failure(
      "CREATE_ADVERTISEMENT.TEMPLATES.SELECT_CANCELLED",
      true
    )
  }

  selectTemplate(template: AdvertisementTemplateShort) {
    this.notificationService.startLoading("NOTIFICATIONS.LOADING", true)
    this.advertisementTemplateService
      .findTemplatePreviewById(template.id)
      .pipe(
        tap(() => this.notificationService.stopLoading()),
        mergeMap((template) => {
          return this.matDialog
            .open(AdvertisementTemplateConfirmApplyDialogComponent, {
              data: {
                advertisementTemplatePreview: template
              }
            })
            .afterClosed()
        }),
        tap(result => {
          if (result !== ConfirmationDialogResult.CONFIRMED) {
            this.cancelTemplateApply()
          }
        }),
        //Filter out all non-confirmed applications
        filter((result) => result === ConfirmationDialogResult.CONFIRMED),
        //Now we are sure that application was confirmed, let's handle the rest :)
        //First let's retrieve resources for given template, as they are not being send with the template
        mergeMap(() => this.advertisementTemplateService.getResourcesForTemplate(template)),
        //When we have data, only thing that remains is to edit
        map((resources) => this.resourcesToAdvertismentItems(resources))
      )
      .subscribe((items) => this.applyTemplateResources(items))
  }

  onNameFilterChange(nameFilter: string) {
    this.templatesFilter$.next(
      {
        ...this.templatesFilter$.value,
        name: this.multilingualTextService.createLocalizedTextForCurrentLang(nameFilter)
      })
  }

  templateToString = (template: AdvertisementTemplateShort) => {
    return this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(template.name)
  }

  private showEditDialog(itemToEdit?: Nullable<AdvertisementItem>,
                         onSuccess?: (updatedItem: AdvertisementItem) => void,
                         onFail?: (dialogResult: DialogResults, data?: unknown) => void) {
    this.matDialog
      .open(AdvertisedItemEditDialogComponent,
        {
          data: <AdvertisedItemEditDialogData>{
            item: itemToEdit ? {...itemToEdit} : undefined,
            advertisementType: this.advertisementType,
            defaultLanguage: this.defaultLanguage
          }
        }
      )
      .afterClosed()
      .pipe(first())
      .subscribe((dialogResult: { result: DialogResults, data?: AdvertisementItem }) => {
        const updatedItem = dialogResult?.data
        if (!dialogResult || !updatedItem || dialogResult.result === DialogResults.FAILURE) {
          onFail?.(dialogResult.result, dialogResult.data)
        } else {
          onSuccess?.(updatedItem)
        }
      })
  }

  private saveEditedItem(editedItem: AdvertisementItem) {
    const updatedArr = this.instantListedItems.map(item => item.id === editedItem.id ? editedItem : item)
    this.listedItems$.next(updatedArr)
  }

  onEdit(advertisedItem: AdvertisementItem) {
    const errorAction = () => this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.EDIT_NOT_SUCCESSFUL", true)
    const successAction = (updatedItem: AdvertisementItem) => {
      if (this.advertisementItemResourceUniqueInTable(updatedItem)) {
        this.saveEditedItem(updatedItem)
      } else {
        this.notificationService.failure(
          "CREATE_ADVERTISEMENT.LISTED_ITEMS.ERRORS.ITEM_NOT_ADDED_DUPLICATED_RESOURCE",
          true
        )
      }
    }
    this.showEditDialog(advertisedItem, successAction, errorAction)
  }

  onDelete(itemToDelete: AdvertisementItem) {
    this.notificationService.confirm(
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.TITLE",
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.MESSAGE",
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.OK_BUTTON",
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.CANCEL_BUTTON",
      true,
      () => {
        this.listedItems$.next(
          this.instantListedItems.filter(advertisedItem => advertisedItem.id !== itemToDelete.id)
        )
      }
    )
  }

  private advertisementItemResourceUniqueInTable(advertisementItem: AdvertisementItem) {
    return !anyMatch(
      this.instantListedItems,
      (item) => {
        return item.resource.id === advertisementItem.resource.id && item.id !== advertisementItem.id
      }
    )
  }

  private addItem(advertisedItem: AdvertisementItem) {
    if (!this.advertisementItemResourceUniqueInTable(advertisedItem)) {
      this.notificationService.failure(
        "CREATE_ADVERTISEMENT.LISTED_ITEMS.ERRORS.ITEM_NOT_ADDED_DUPLICATED_RESOURCE",
        true
      )
      return;
    }

    if (!isDefinedNotEmpty(advertisedItem.id)) {
      advertisedItem.id = uuidv4()
    }
    const updatedItems = [...this.instantListedItems, advertisedItem]
    this.listedItems$.next(updatedItems)
  }

  onAdd() {
    const errorAction = () => this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.ADDITION_NOT_SUCCESSFUL", true)
    const successAction = (addedItem: AdvertisementItem) => this.addItem(addedItem)
    this.showEditDialog(null, successAction, errorAction)
  }

  showListedItemDetail(item: AdvertisementItem) {
    this.matDialog.open<AdvertisedItemInfoDialogComponent>(
      AdvertisedItemInfoDialogComponent, {
        data: item
      })
  }

  changePage(pageRequest: PageRequest) {
    this.lastPageRequest = pageRequest
    this.refreshItemsPage()
  }
}
