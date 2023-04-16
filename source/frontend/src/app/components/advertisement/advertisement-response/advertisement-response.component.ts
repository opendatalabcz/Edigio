import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {
  AdvertisementResponse,
  AdvertisementResponseCreateData
} from "../../../models/advertisement/advertisement-response";
import {phoneNumberValidator} from "../../../validators/contact-validators";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {oppositeAdvertisementType} from "../../../utils/advertisement-utils";
import {MultilingualText} from "../../../models/common/multilingual-text";
import {MatDialog} from "@angular/material/dialog";
import {
  ResponseItemEditDialogComponent,
  ResponseItemEditDialogData,
  ResponseItemEditDialogResult
} from "../response-item-edit-dialog/response-item-edit-dialog.component";
import {DialogResults} from "../../../models/common/dialogResults";
import {NotificationService} from "../../../services/notification.service";
import {ResponseItemInfoDialogComponent} from "../response-item-info-dialog/response-item-info-dialog.component";
import {v4 as uuidv4} from 'uuid'
import {BehaviorSubject, first} from "rxjs";
import {PageRequest} from "../../../models/pagination/page-request";
import {pageFromItems} from "../../../utils/page-utils";
import {PageInfo} from "../../../models/pagination/page";
import {Nullable} from "../../../utils/types/common";
import {isDefinedNotBlank, isDefinedNotEmpty} from "../../../utils/predicates/string-predicates";
import {ResponseItem} from "../../../models/advertisement/response-item";
import {requireDefinedNotNull} from "../../../utils/assertions/object-assertions";
import {AdvertisementResponseService} from "../../../services/advertisement-response.service";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {UserService} from "../../../services/user.service";

interface AdvertisementResponseFormControl {
  firstname: FormControl<string>,
  lastname: FormControl<string>,
  email: FormControl<string>,
  repeatEmail: FormControl<string>
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

  @ViewChild('formDirective') private formDirective?: NgForm;

  private _initialAdvertisementResponse?: AdvertisementResponse;
  listedItemsPage$: BehaviorSubject<ResponseItem[]> = new BehaviorSubject<ResponseItem[]>([]);
  private lastPageRequest: PageRequest = {idx: 0, size: 5}

  private get currentListedItemsPage(): ResponseItem[] {
    return this.listedItemsPage$.value
  }

  private _allListedItems: ResponseItem[] = []

  value?: MultilingualText

  @Input() set initialAdvertisementResponse(initialAdvertisementResponse: AdvertisementResponse) {
    this._initialAdvertisementResponse = initialAdvertisementResponse
    this.resetAllListedItems()
  }

  private resetAllListedItems() {
    this._allListedItems = [...requireDefinedNotNull(this._initialAdvertisementResponse).listedItems]
    this.changePage(this.lastPageRequest)
  }

  private _advertisementType?: AdvertisementType
  @Input() set advertisementType(value: AdvertisementType) {
    this._advertisementType = value
  }

  get advertisementType(): AdvertisementType {
    return requireDefinedNotNull(this._advertisementType)
  }


  get pageInfo(): PageInfo {
    return {
      idx: this.lastPageRequest.idx,
      size: this.lastPageRequest.size,
      totalItemsAvailable: this._allListedItems.length
    }
  }

  get initialAdvertisementResponse(): AdvertisementResponse {
    if (!this._initialAdvertisementResponse) {
      throw new Error('Initial advertisement response not given!')
    }
    return this._initialAdvertisementResponse;
  }

  private _isUserLoggedIn: boolean = false
  get isUserLoggedIn(): boolean {
    return this._isUserLoggedIn
  }

  set isUserLoggedIn(value: boolean) {
    this._isUserLoggedIn = value
    if (value) {
      this._form?.disable()
    } else {
      this._form?.enable()
    }
  }

  constructor(private fb: FormBuilder,
              private matDialog: MatDialog,
              private notificationService: NotificationService,
              private advertisementResponseService: AdvertisementResponseService,
              private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.userService.isUserLoggedIn$()
      .subscribe({
        next: (isLoggedIn) => this.isUserLoggedIn = isLoggedIn
      })
    this.form = this.fb.nonNullable.group({
      firstname: [this.initialAdvertisementResponse.responder?.firstname ?? "", [
        Validators.required,
        RxwebValidators.notEmpty()
      ]],
      lastname: [this.initialAdvertisementResponse.responder?.lastname ?? "", [
        Validators.required,
        RxwebValidators.notEmpty()
      ]],
      email: [this.initialAdvertisementResponse.responder?.email ?? "", [Validators.required, Validators.email]],
      repeatEmail: [this.initialAdvertisementResponse.responder?.email ?? "", [
        Validators.required,
        RxwebValidators.compare({
          fieldName: 'email'
        })
      ]],
      telephoneNumber: [this.initialAdvertisementResponse.responder?.telephoneNumber ?? "", [phoneNumberValidator]],
      note: [""],
      privacyPolicyConsent: [false, [Validators.requiredTrue]],
      termsOfServiceConsent: [false, [Validators.requiredTrue]]
    })
    if (this.isUserLoggedIn) {
      this.form.disable()
    } else {
      this.form.enable()
    }
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

  isFormValid(): boolean {
    return this.isUserLoggedIn || this.form.valid
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
                         onFail?: (dialogResult?: DialogResults, data?: unknown) => void) {
    this.matDialog
      .open<ResponseItemEditDialogComponent, ResponseItemEditDialogData, ResponseItemEditDialogResult>(
        ResponseItemEditDialogComponent,
        {
          data: {
            item: itemToEdit ? {...itemToEdit} : undefined,
            advertisementType: this.advertisementType
          }
        }
      )
      .afterClosed()
      .pipe(first())
      .subscribe((dialogResult?: ResponseItemEditDialogResult) => {
        const updatedItem = dialogResult?.data
        if (!dialogResult || !updatedItem || dialogResult.result === DialogResults.FAILURE) {
          onFail?.(dialogResult?.result, dialogResult?.data)
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
    if (!isDefinedNotEmpty(listedItem.id)) {
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

  private formToAdvertisementResponse(form: AdvertisementResponseFormGroup): AdvertisementResponseCreateData {
    return {
      advertisementId: this.initialAdvertisementResponse.advertisement.id,
      listedItems: this._allListedItems.map((item: ResponseItem) => ({
        resourceId: item.resource.id,
        description: item.description,
        amount: item.amount,
      })),
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
    if (err instanceof HttpErrorResponse) {
      if (err.status === HttpStatusCode.NotFound) {
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_404", true)
      } else if (err.status === HttpStatusCode.BadRequest) {
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_BAD_REQUEST", true)
      } else if (err.status === HttpStatusCode.Forbidden) {
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_FORBIDDEN", true)
      } else if (err.status === HttpStatusCode.Unauthorized) {
        //TODO: When user is implemented, add redirect to login page here (if it isn't placed somewhere before this part)
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_UNAUTHORIZED", true)
      } else if (err.status >= 500) {
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_5xx", true)
      } else if (err.status >= 400) {
        this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.CREATION_ERROR_4xx", true)
      }
    } else {
      this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.UNKNOWN_CREATION_ERROR", true)
    }
  }

  private reset() {
    this.form.reset()
    this.formDirective?.resetForm()
    this.resetAllListedItems();
  }

  private handleCreationSuccess() {
    this.notificationService.success(
      "ADVERTISEMENT_RESPONSE_FORM.VERIFICATION_LINK_SENT",
      true
    )
    this.reset()
  }

  onSubmit(form: AdvertisementResponseFormGroup) {
    if (form.invalid) {
      this.notificationService.failure("FORMS.ERRORS.SUBMIT_FAILED", true)
    } else {
      const createdResponse = this.formToAdvertisementResponse(form)
      this.notificationService.startLoading("ADVERTISEMENT_RESPONSE_FORM.REQUESTING_CREATION", true)
      this.advertisementResponseService.createNewResponse(createdResponse)
        .pipe(first())
        .subscribe({
          next: () => this.handleCreationSuccess(),
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
