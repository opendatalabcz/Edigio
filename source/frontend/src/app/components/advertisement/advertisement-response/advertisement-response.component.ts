import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdvertisementResponse} from "../../../models/advertisement/advertisement-response";
import {personNamePartValidator, phoneNumberValidator} from "../../../validators/contact-validators";
import {ListedItem} from "../../../models/advertisement/resource";
import {AdvertisedItem, AdvertisementType, ResponseItem} from "../../../models/advertisement/advertisement";
import {oppositeAdvertisementType} from "../../../utils/advertisement-utils";
import {MultilingualText} from "../../../models/common/multilingual-text";
import {MatInput} from "@angular/material/input";
import {MatDialog} from "@angular/material/dialog";
import {ResponseItemEditDialogComponent} from "../response-item-edit-dialog/response-item-edit-dialog.component";
import {DialogResults} from "../../../models/common/dialogResults";
import {Notify} from "notiflix";
import {NotificationService} from "../../../services/notification.service";
import {AdvertisedItemInfoDialogComponent} from "../advertised-item-info-dialog/advertised-item-info-dialog.component";
import {ResponseItemInfoDialogComponent} from "../response-item-info-dialog/response-item-info-dialog.component";

@Component({
  selector: 'app-advertisement-response',
  templateUrl: './advertisement-response.component.html',
  styleUrls: ['./advertisement-response.component.scss']
})
export class AdvertisementResponseComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  private _initialAdvertisementResponse?: AdvertisementResponse;
  listedItems: ResponseItem[] = [];

  value?: MultilingualText

  @Input() set initialAdvertisementResponse(initialAdvertisementResponse: AdvertisementResponse) {
    this._initialAdvertisementResponse = initialAdvertisementResponse
    this.listedItems = [...this._initialAdvertisementResponse.listedItems]
  }

  @Input() advertisementType?: AdvertisementType

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
      telephoneNumber: [this.initialAdvertisementResponse.contact.telephoneNumber, [phoneNumberValidator]]
    })
  }

  get oppositeAdvertisementType(): AdvertisementType | undefined {
    return this.advertisementType ? oppositeAdvertisementType(this.advertisementType) : undefined
  }

  onListedItemDelete(deletedItem: ResponseItem) {
     this.notificationService.confirm(
      "Wann play a game?",
      "Hey kid, wann play a game",
      "Sure",
      "Nope!",
      false,
      () => this.listedItems = this.listedItems.filter((item) => item.id !== deletedItem.id),
    )
  }

  onListedItemEdit(itemToEdit: ResponseItem) {
    this.matDialog.open(ResponseItemEditDialogComponent, {data: {...itemToEdit}})
      .afterClosed()
      .subscribe((dialogResult: {result: DialogResults, data?: ResponseItem})  => {
        if(!dialogResult || dialogResult.result === DialogResults.FAILURE) {
          this.notificationService.failure("ADVERTISEMENT_RESPONSE_FORM.EDIT_NOT_SUCCESSFUL", true)
          return;
        }
        const updatedItem = dialogResult?.data
        if(dialogResult.result === DialogResults.SUCCESS && updatedItem) {
          const itemIndex = this.listedItems.findIndex(
            //Make sure we there are not two items for the same resource
            listedItem => listedItem.resource.id === updatedItem.resource.id && listedItem.id !== updatedItem.id
          );
          if(itemIndex >= 0 && this.listedItems[itemIndex].id !== updatedItem.id) {
            this.notificationService
              .failure("ADVERTISEMENT_RESPONSE_FORM.ERRORS.TWO_ITEMS_SAME_RESOURCE", true)
          } else {
            //Doing it that way to trigger table re-rendering
            this.listedItems
              = this.listedItems.map(listedItem => listedItem.id === itemToEdit.id ? updatedItem : listedItem)
            //Using temporary variable to make suppress errors caused by possible undefined values
            this.notificationService.success("ADVERTISEMENT_RESPONSE_FORM.LISTED_ITEM_EDIT_SUCCESS", true)
          }
        }
      })
  }

  showListedItemDetail(listedItem: ResponseItem) {
    this.matDialog.open(ResponseItemInfoDialogComponent, {data: listedItem})
  }


  onSubmit() {
    console.log('submitted')
  }
}
