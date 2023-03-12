import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AdvertisementResponse} from "../../../models/advertisement/advertisement-response";
import {personNamePartValidator, phoneNumberValidator} from "../../../validators/contact-validators";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
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
import {Nullable} from "../../../utils/types/common";
import {isDefinedNotBlank, isDefinedNotEmpty} from "../../../utils/predicates/string-predicates";
import {AdvertisedItem} from "../../../models/advertisement/advertised-item";
import {ResponseItem} from "../../../models/advertisement/response-item";
import {requireDefinedNotNull} from "../../../utils/assertions/object-assertions";
import {AdvertisementResponseService} from "../../../services/advertisement-response.service";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";

interface AdvertisementResponseFormControl {
  firstname: FormControl<string>,
  lastname: FormControl<string>,
  email: FormControl<string>,
  telephoneNumber: FormControl<string>,
  note: FormControl<string>
  privacyPolicyConsent: FormControl<boolean>,
  termsOfServiceConsent: FormControl<boolean>
}

type AdvertisementResponseFormGroup = FormGroup<AdvertisementResponseFormControl>

@Component({
  selector: 'app-advertisement-response',
  templateUrl: './advertisement-response.component.html',
  styleUrls: ['./advertisement-response.component.scss']
})
export class AdvertisementResponseComponent implements OnInit {
  _form?: AdvertisementResponseFormGroup
  get form(): AdvertisementResponseFormGroup {
    return requireDefinedNotNull(this._form)
  }
  set form(value: AdvertisementResponseFormGroup) {
    this._form = value
  }

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
              private notificationService: NotificationService,
              private advertisementResponseService: AdvertisementResponseService
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      firstname: [this.initialAdvertisementResponse.contact.firstname ?? "", [Validators.required, personNamePartValidator]],
      lastname: [this.initialAdvertisementResponse.contact.lastname ?? "", [Validators.required, personNamePartValidator]],
      email: [this.initialAdvertisementResponse.contact.email ?? "", [Validators.required, Validators.email]],
      telephoneNumber: [this.initialAdvertisementResponse.contact.telephoneNumber ?? "", [phoneNumberValidator]],
      note: [""],
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
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.TITLE",
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.MESSAGE",
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.OK_BUTTON",
      "ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT.DELETE.CONFIRMATION.CANCEL_BUTTON",
      true,
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

  private showEditDialog(itemToEdit?: Nullable<ResponseItem>,
                         onSuccess?: (updatedItem: ResponseItem) => void,
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
      .subscribe((dialogResult: { result: DialogResults, data?: ResponseItem }) => {
        const updatedItem = dialogResult?.data
        if (!dialogResult || !updatedItem || dialogResult.result === DialogResults.FAILURE) {
          onFail?.(dialogResult.result, dialogResult.data)
        } else {
          onSuccess?.(updatedItem)
        }
      })
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
    const successAction = (updatedItem: ResponseItem) => this.updateItemOnFormSuccess(updatedItem, itemToEdit.id)
    const failAction = () => this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.EDIT_NOT_SUCCESSFUL", true)
    this.showEditDialog(itemToEdit, successAction, failAction)
  }

  private addListedItem(listedItem: ResponseItem) {
    if(!isDefinedNotEmpty(listedItem.id)) {
      listedItem.id = uuidv4()
    }
    const itemValid = this.validateItem(listedItem)
    if (itemValid) {
      this._allListedItems.push(listedItem)
      this.changePage(this.lastPageRequest)
    }
  }

  onListedItemAdd() {
    const successAction = (addedItem: ResponseItem) => this.addListedItem(addedItem)
    const failAction = () => this.notificationService.success("ADVERTISEMENT_RESPONSE_FORM.ADDITION_NOT_SUCCESSFUL", true)
    this.showEditDialog(null, successAction, failAction)
  }

  showListedItemDetail(listedItem: ResponseItem) {
    this.matDialog.open(ResponseItemInfoDialogComponent, {data: listedItem})
  }

  private formToAdvertisementResponse(form: AdvertisementResponseFormGroup) : AdvertisementResponse {
    return  {
      advertisementId: this.initialAdvertisementResponse.advertisementId,
      listedItems: this._allListedItems,
      contact: {
        firstname: form.value.firstname,
        lastname: form.value.lastname,
        email: form.value.email,
        telephoneNumber: isDefinedNotBlank(this.form.value.telephoneNumber) ? this.form.value.telephoneNumber : null,
      },
      note: form.value.note
    }
  }

  private handleCreationError(err: unknown): void {
    if(err instanceof HttpErrorResponse) {
      if(err.status === HttpStatusCode.NotFound) {
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_404", true)
      } else if(err.status === HttpStatusCode.BadRequest) {
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_BAD_REQUEST", true)
      } else if(err.status === HttpStatusCode.Forbidden) {
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_FORBIDDEN", true)
      } else if(err.status === HttpStatusCode.Unauthorized) {
        //TODO: When user is implemented, add redirect to login page here (if it isn't placed somewher before this part)
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_UNAUTHORIZED", true)
      } else if(err.status >= 500) {
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_5xx", true)
      } else if(err.status >= 400) {
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_4xx", true)
      }
    } else {
      this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.UNKNOWN_CREATION_ERROR", true)
    }
  }

  onSubmit(form: AdvertisementResponseFormGroup) {
    if(form.invalid) {
      this.notificationService.failure("FORMS.ERRORS.SUBMIT_FAILED", true)
    } else {
      const createdResponse = this.formToAdvertisementResponse(form)
      this.notificationService.startLoading("ADVERTISEMENT_RESPONSE_FORM.REQUESTING_CREATION", true)
      this.advertisementResponseService.createNewResponse(createdResponse)
        .pipe(first())
        .subscribe({
          next: () => this.notificationService.success("ADVERTISEMENT_RESPONSE_FORM.VERIFICATION_LINK_SENT", true),
          error: (err: unknown) => this.handleCreationError(err),
        })
        .add(() => {
          this.notificationService.stopLoading()
        })
    }
  }

  changePage(pageRequest: PageRequest) {
    this.listedItemsPage$.next(
      pageFromItems(this._allListedItems, pageRequest).items
    )
    this.lastPageRequest = pageRequest
  }
}
