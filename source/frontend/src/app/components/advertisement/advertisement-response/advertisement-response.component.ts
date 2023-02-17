import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdvertisementResponse} from "../../../models/advertisement/advertisement-response";
import {personNamePartValidator, phoneNumberValidator} from "../../../validators/contact-validators";
import {AdvertisementType, ResponseItem} from "../../../models/advertisement/advertisement";
import {oppositeAdvertisementType} from "../../../utils/advertisement-utils";
import {MultilingualText} from "../../../models/common/multilingual-text";
import {MatDialog} from "@angular/material/dialog";
import {ResponseItemEditDialogComponent} from "../response-item-edit-dialog/response-item-edit-dialog.component";
import {DialogResults} from "../../../models/common/dialogResults";
import {NotificationService} from "../../../services/notification.service";
import {ResponseItemInfoDialogComponent} from "../response-item-info-dialog/response-item-info-dialog.component";
import {v4 as uuidv4} from 'uuid'
import {BehaviorSubject, first} from "rxjs";
import {PageRequest} from "../../../models/pagination/page-request";
import {SortDirection} from "../../../models/common/sort-direction";
import {pageFromItems} from "../../../utils/page-utils";
import {PageInfo} from "../../../models/pagination/page";

@Component({
  selector: 'app-advertisement-response',
  templateUrl: './advertisement-response.component.html',
  styleUrls: ['./advertisement-response.component.scss']
})
export class AdvertisementResponseComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  private _initialAdvertisementResponse?: AdvertisementResponse;
  listedItemsPage$: BehaviorSubject<ResponseItem[]> = new BehaviorSubject<ResponseItem[]>([]);
  private lastPageRequest: PageRequest = {idx: 0, size: 5, sortDirection: SortDirection.ASCENDING}

  private get currentListedItemsPage(): ResponseItem[] {
    return this.listedItemsPage$.value
  }

  private _allListedItems: ResponseItem[] = []

  value?: MultilingualText

  @Input() set initialAdvertisementResponse(initialAdvertisementResponse: AdvertisementResponse) {
    this._initialAdvertisementResponse = initialAdvertisementResponse
    this._allListedItems = [...this._initialAdvertisementResponse.listedItems]
    this.changePage(this.lastPageRequest)
  }

  @Input() advertisementType?: AdvertisementType

  get pageInfo(): PageInfo {
    return {
      idx: this.lastPageRequest.idx,
      size: this.lastPageRequest.size,
      sortDirection: this.lastPageRequest.sortDirection,
      totalItemsAvailable: this._allListedItems.length
    }
  }

  get initialAdvertisementResponse(): AdvertisementResponse {
    if (!this._initialAdvertisementResponse) {
      throw new Error('Initial advertisement response not given!')
    }
    return this._initialAdvertisementResponse;
  }

  constructor(private fb: FormBuilder,
              private matDialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstname: [this.initialAdvertisementResponse.contact.firstname, [Validators.required, personNamePartValidator]],
      lastname: [this.initialAdvertisementResponse.contact.lastname, [Validators.required, personNamePartValidator]],
      email: [this.initialAdvertisementResponse.contact.email, [Validators.required, Validators.email]],
      telephoneNumber: [this.initialAdvertisementResponse.contact.telephoneNumber, [phoneNumberValidator]],
      privacyPolicyConsent: [false, [Validators.requiredTrue]],
      termsOfServiceConsent: [false, [Validators.requiredTrue]]
    })
    this.changePage(this.lastPageRequest)
  }

  get oppositeAdvertisementType(): AdvertisementType | undefined {
    return this.advertisementType ? oppositeAdvertisementType(this.advertisementType) : undefined
  }

  onListedItemDelete(deletedItem: ResponseItem) {
    this.notificationService.confirm(
      //TODO: Replace messages with something that makes sense and is localized
      "Wann play a game?",
      "Hey kid, wann play a game",
      "Sure",
      "Nope!",
      false,
      () => {
        this._allListedItems = this._allListedItems.filter((item) => item.id !== deletedItem.id)
        this.changePage(this.lastPageRequest)
      }
    )
  }

  private validateItem(item: ResponseItem) {
    const itemIndex = this._allListedItems.findIndex(
      //Make sure we there are not two items for the same resource
      listedItem => listedItem.resource.id === item.resource.id && listedItem.id !== item.id
    );
    const isValid = itemIndex < 0
    if (!isValid) {
      this.notificationService
        .failure("ADVERTISEMENT_RESPONSE_FORM.ERRORS.TWO_ITEMS_SAME_RESOURCE", true)
    }
    return isValid;
  }

  private updateItemOnFormSuccess(updatedItem: ResponseItem, originalItemId?: string) {
    const isValid = this.validateItem(updatedItem)
    if (isValid) {
      //Doing it that way to trigger table re-rendering
      this._allListedItems =
        this._allListedItems.map(listedItem => listedItem.id === originalItemId ? updatedItem : listedItem)
      //Using temporary variable to make suppress errors caused by possible undefined values
      this.notificationService.success("ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT_SUCCESS", true)
      this.changePage(this.lastPageRequest)
    }
  }

  onListedItemEdit(itemToEdit: ResponseItem) {
    this.matDialog
      .open(ResponseItemEditDialogComponent,
        {data: {item: {...itemToEdit}, advertisementType: this.oppositeAdvertisementType}}
      )
      .afterClosed()
      .subscribe((dialogResult: { result: DialogResults, data?: ResponseItem }) => {
        if (!dialogResult || dialogResult.result === DialogResults.FAILURE) {
          this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.EDIT_NOT_SUCCESSFUL", true)
          return;
        }
        const updatedItem = dialogResult?.data
        if (dialogResult.result === DialogResults.SUCCESS && updatedItem) {
          this.updateItemOnFormSuccess(updatedItem, itemToEdit.id)
        }
      })
  }

  private addListedItem(listedItem: ResponseItem) {
    const itemValid = this.validateItem(listedItem)
    if (itemValid) {
      this._allListedItems.push(listedItem)
      this.changePage(this.lastPageRequest)
    }
  }

  onListedItemAdd() {
    this.matDialog
      .open(ResponseItemEditDialogComponent, {data: {advertisementType: this.oppositeAdvertisementType}})
      .afterClosed()
      .pipe(first())
      .subscribe((dialogResult: { result: DialogResults, data?: ResponseItem }) => {
        if (!dialogResult || dialogResult.result === DialogResults.FAILURE) {
          this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.EDIT_NOT_SUCCESSFUL", true)
          return;
        }
        const itemToAdd = dialogResult?.data
        if (dialogResult.result === DialogResults.SUCCESS && itemToAdd) {
          itemToAdd.id = uuidv4()
          this.addListedItem(itemToAdd);
        }
      })
  }

  showListedItemDetail(listedItem: ResponseItem) {
    this.matDialog.open(ResponseItemInfoDialogComponent, {data: listedItem})
  }

  onSubmit(form: FormGroup) {
    if(form.invalid) {
      this.notificationService.failure("FORMS.ERRORS.SUBMIT_FAILED", true)
    } else {
      this.notificationService.success("ADVERTISEMENT_RESPONSE_FORM.VERIFICATION_LINK_SENT", true)
    }
  }

  changePage(pageRequest: PageRequest) {
    this.listedItemsPage$.next(
      pageFromItems(this._allListedItems, pageRequest).items
    )
    this.lastPageRequest = pageRequest
  }
}
