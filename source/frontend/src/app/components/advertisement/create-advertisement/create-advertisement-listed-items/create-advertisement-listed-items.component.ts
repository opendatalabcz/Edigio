import {Component, Input} from '@angular/core';
import {AdvertisementTemplate} from "../../../../models/advertisement/advertisement-template";
import {BehaviorSubject, filter, first, forkJoin, map, mergeMap, Observable, startWith, tap} from "rxjs";
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
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {Nullable} from "../../../../utils/types/common";
import {isDefinedNotEmpty} from "../../../../utils/predicates/string-predicates";
import {anyMatch} from "../../../../utils/array-utils";
import {Page, PageInfo} from "../../../../models/pagination/page";
import {extractPageInfo, pageFromItems, pageRequestForPage} from "../../../../utils/page-utils";
import {SortDirection} from "../../../../models/common/sort-direction";
import {
  AdvertisedItemEditDialogComponent, AdvertisedItemEditDialogData
} from "../../advertised-item-edit-dialog/advertised-item-edit-dialog.component";
import {MultilingualText} from "../../../../models/common/multilingual-text";
import {
  AdvertisedItemInfoDialogComponent
} from "../../advertised-item-info-dialog/advertised-item-info-dialog.component";
import {AdvertisedItem} from "../../../../models/advertisement/advertised-item";
import {
  AdvertisementTemplateConfirmApplyDialogComponent
} from "../../advertisement-template-confirm-apply-dialog/advertisement-template-confirm-apply-dialog.component";
import {AdvertisementHelpType} from "../../../../models/advertisement/advertisement-help-type";

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
  templates$: BehaviorSubject<AdvertisementTemplate[]> = new BehaviorSubject<AdvertisementTemplate[]>([])
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

  /**
   * Set advertisement type, and also update template filter with new type
   * @param advertisementType type to be set
   */
  @Input() set advertisementType(advertisementType: AdvertisementType) {
    this._advertisementType = advertisementType
    this.templatesFilter$.next({
      ...this.templatesFilter$.value,
      advertisementTypes: [advertisementType]
    })
  }

  private _advertisementHelpType?: AdvertisementHelpType

  @Input() set advertisementHelpType(helpType: AdvertisementHelpType) {
    this._advertisementHelpType = helpType
    this.templatesFilter$.next({...this.templatesFilter$.value, advertisementHelpTypes: [helpType]})
  }

  /**
   * All items listed in advertisement
   */
  listedItems$: BehaviorSubject<AdvertisedItem[]> = new BehaviorSubject<AdvertisedItem[]>([])

  get instantListedItems() : AdvertisedItem[] {
    return this.listedItems$.value
  }

  /**
   * Currently displayed page of listed items in table
   */
  listedItemsPage$: BehaviorSubject<Page<AdvertisedItem>> = new BehaviorSubject<Page<AdvertisedItem>>(
    pageFromItems([], {idx: 0, size: 5})
  )

  /**
   * Observable of items available in listed items array
   */
  get listedItemsPageItems$(): Observable<AdvertisedItem[]> {
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
    console.log('Set default lang to ', this._defaultLanguage)
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
    this.initCatastropheTypeSubscription()
    this.initListedItemsUpdate()
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
    //Everytime when catastrophe type changes in step that's before this step,
    // we need to make sure that filter will be updated

  }

  private refreshItemsPage() {
    //
    const updatedPage = pageFromItems(
      this.instantListedItems,
      pageRequestForPage(this.listedItemsPage$.value)
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

  private resourcesToAdvertismentItems(resources: ResourceShort[]): AdvertisedItem[] {
    return resources.map((res) => ({
      id: uuidv4(),
      description: MultilingualText.of({languageCode: this.defaultLanguage.code, text: ''}),
      resource: res,
      amount: 1,
    }))
  }

  private applyTemplateResources(items: AdvertisedItem[]) {
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

  selectTemplate(template: AdvertisementTemplate) {
    this.matDialog
      .open(AdvertisementTemplateConfirmApplyDialogComponent, {
        data: {
          advertisementTemplate: template
        }
      })
      .afterClosed()
      .pipe(
        //Handle situation when application wasn't confirmed
        tap(result => {
          if(result !== ConfirmationDialogResult.CONFIRMED) {
            this.cancelTemplateApply()
          }
        }),
        //Filter out all non-confirmed applications
        filter((result) => result === ConfirmationDialogResult.CONFIRMED),
        //Now we are sure that application was confirmed, let's handle the rest :)
        mergeMap(() => this.advertisementTemplateService.getResourcesForTemplate(template)),
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

  templateToString = (template: AdvertisementTemplate) => {
    return this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(template.name)
  }

  private showEditDialog(itemToEdit?: Nullable<AdvertisedItem>,
                         onSuccess?: (updatedItem: AdvertisedItem) => void,
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
      .subscribe((dialogResult: { result: DialogResults, data?: AdvertisedItem }) => {
        const updatedItem = dialogResult?.data
        if (!dialogResult || !updatedItem || dialogResult.result === DialogResults.FAILURE) {
          onFail?.(dialogResult.result, dialogResult.data)
        } else {
          onSuccess?.(updatedItem)
        }
      })
  }

  private saveEditedItem(editedItem: AdvertisedItem) {
    const updatedArr = this.instantListedItems.map(item => item.id === editedItem.id ? editedItem : item)
    this.listedItems$.next(updatedArr)
  }

  onEdit(advertisedItem: AdvertisedItem) {
    const errorAction = () => this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.EDIT_NOT_SUCCESSFUL", true)
    const successAction = (updatedItem: AdvertisedItem) => {
      if(this.advertisementItemResourceUniqueInTable(updatedItem)) {
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

  onDelete(itemToDelete: AdvertisedItem) {
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

  private advertisementItemResourceUniqueInTable(advertisementItem: AdvertisedItem) {
    console.log('Advertised: ', advertisementItem, '; items: ', this.instantListedItems )
    return !anyMatch(
      this.instantListedItems,
      (item) => {
        return item.resource.id === advertisementItem.resource.id && item.id !== advertisementItem.id
      }
    )
  }

  private addItem(advertisedItem: AdvertisedItem) {
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
    const successAction = (addedItem: AdvertisedItem) => this.addItem(addedItem)
    this.showEditDialog(null, successAction, errorAction)
  }

  showListedItemDetail(item: AdvertisedItem) {
    this.matDialog.open<AdvertisedItemInfoDialogComponent>(
      AdvertisedItemInfoDialogComponent, {
        data: item
      })
  }
}
