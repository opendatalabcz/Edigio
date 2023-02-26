import {Component, Input} from '@angular/core';
import {AdvertisementTemplate} from "../../../../models/advertisement/advertisement-template";
import {BehaviorSubject, first, map, mergeMap, Observable, startWith, tap} from "rxjs";
import {MultilingualTextService} from "../../../../services/multilingual-text.service";
import {NotificationService} from "../../../../services/notification.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AdvertisementTemplateFilter} from "../../../../models/advertisement/advertisement-template-filter";
import {ProjectService} from "../../../../services/project.service";
import {AdvertisementTemplateService} from "../../../../services/advertisement-template.service";
import {AdvertisedItem, AdvertisementType} from "../../../../models/advertisement/advertisement";
import {ResourceShort} from "../../../../models/advertisement/resource";
import {v4 as uuidv4} from "uuid";
import {MatDialog} from "@angular/material/dialog";
import {ResponseItemEditDialogComponent} from "../../response-item-edit-dialog/response-item-edit-dialog.component";
import {DialogResults} from "../../../../models/common/dialogResults";
import {ReadOnlyLanguage} from "../../../../models/common/language";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {Nullable} from "../../../../utils/types/common";
import {isDefinedNotEmpty} from "../../../../utils/predicates/string-predicates";
import {anyMatch} from "../../../../utils/array-utils";
import {Page, PageInfo} from "../../../../models/pagination/page";
import {extractPageInfo, pageFromItems, pageRequestForPage} from "../../../../utils/page-utils";
import {SortDirection} from "../../../../models/common/sort-direction";

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
    this.templatesFilter$.next({...this.templatesFilter$.value, advertisementTypes: [advertisementType]})
  }

  /**
   * All items listed in advertisement
   */
  listedItems$: BehaviorSubject<AdvertisedItem[]> = new BehaviorSubject<AdvertisedItem[]>([])

  /**
   * Currently displayed page of listed items in table
   */
  listedItemsPage$: BehaviorSubject<Page<AdvertisedItem>> = new BehaviorSubject<Page<AdvertisedItem>>(
    pageFromItems([], {idx: 0, size: 5, sortDirection: SortDirection.ASCENDING})
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
    this.projectService.currentProjectCatastropheType$()
      .pipe(untilDestroyed(this))
      .subscribe(catastropheType => this.templatesFilter$.next({
        ...this.templatesFilter$.value,
        catastropheTypes: catastropheType ? [catastropheType] : []
      }))
  }

  private refreshItemsPage() {
    console.dir(this.listedItems$.value)
    const updatedPage = pageFromItems(
      this.listedItems$.value,
      pageRequestForPage(this.listedItemsPage$.value)
    )
    console.dir(updatedPage)
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
        this.listedItems$.next(resources)
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

  private showEditDialog(itemToEdit?: Nullable<AdvertisedItem>,
                         onSuccess?: (updatedItem: AdvertisedItem) => void,
                         onFail?: (dialogResult: DialogResults, data?: unknown) => void) {
    this.matDialog
      .open(ResponseItemEditDialogComponent,
        {
          data: {
            item: itemToEdit ? {...itemToEdit} : undefined,
            advertisementType: this.advertisementType
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
          console.dir(dialogResult)
          onSuccess?.(updatedItem)
        }
      })
  }

  onEdit(advertisedItem: AdvertisedItem) {
    //TODO: Implement editation of listed itme
    const errorAction = () => this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.EDIT_NOT_SUCCESSFUL", true)
    const successAction = () => this.notificationService.success("Success mate!", true)
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
          this.listedItems$.value.filter(advertisedItem => advertisedItem.id !== itemToDelete.id)
        )
      }
    )
  }

  private addItem(advertisedItem: AdvertisedItem) {
    if (!isDefinedNotEmpty(advertisedItem.id)) {
      advertisedItem.id = uuidv4()
    } else if (anyMatch(this.listedItems$.value, (item) => item.id === advertisedItem.id)) {
      throw new Error('Cannot add item with same id twice!')
    }
    const updatedItems = [...this.listedItems$.value, advertisedItem]
    this.listedItems$.next(updatedItems)
  }

  onAdd() {
    const errorAction = () => this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.ADDITION_NOT_SUCCESSFUL", true)
    const successAction = (addedItem: AdvertisedItem) => this.addItem(addedItem)
    this.showEditDialog(null, successAction, errorAction)
  }

  showListedItemDetail(item: AdvertisedItem) {
    console.log(item)
  }
}
