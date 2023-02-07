import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdvertisementResponse} from "../../../models/advertisement/advertisement-response";
import {personNamePartValidator, phoneNumberValidator} from "../../../validators/contact-validators";
import {ListedItem} from "../../../models/advertisement/resource";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {oppositeAdvertisementType} from "../../../utils/advertisement-utils";
import {MultilingualText} from "../../../models/common/multilingual-text";
import {MatInput} from "@angular/material/input";
import {MatDialog} from "@angular/material/dialog";
import {ListedItemEditDialogComponent} from "../listed-item-edit-dialog/listed-item-edit-dialog.component";
import {DialogResults} from "../../../models/common/dialogResults";
import {Notify} from "notiflix";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-advertisement-response',
  templateUrl: './advertisement-response.component.html',
  styleUrls: ['./advertisement-response.component.scss']
})
export class AdvertisementResponseComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  private _initialAdvertisementResponse?: AdvertisementResponse;
  listedItems: ListedItem[] = [];

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

  onListedItemDelete(deletedItem: ListedItem) {
    this.listedItems = this.listedItems.filter((item) => item.id !== deletedItem.id)
  }

  onListedItemEdit(itemToEdit: ListedItem) {
    this.matDialog.open(ListedItemEditDialogComponent, {data: {...itemToEdit}})
      .afterClosed()
      .subscribe((dialogResult: {result: DialogResults, data?: ListedItem})  => {
        const updatedItem = dialogResult.data
        if(dialogResult.result === DialogResults.SUCCESS && updatedItem) {
          const itemIndex = this.listedItems.findIndex(
            //Make sure we there are not two items for the same resource
            listedItem => listedItem.resource.id === updatedItem.resource.id && listedItem.id !== updatedItem.id
          );
          if(itemIndex >= 0 && this.listedItems[itemIndex].id !== updatedItem.id) {
            this.notificationService.failure('Two items for the same resource!')
          } else {
            //Doing it that way to trigger table re-rendering
            this.listedItems
              = this.listedItems.map(listedItem => listedItem.id === itemToEdit.id ? updatedItem : listedItem)
            console.dir(this.listedItems)
            //Using temporary variable to make suppress errors caused by possible undefined values
            this.notificationService.success('Item successfully edited!')
          }
        }
        if(dialogResult.result === DialogResults.FAILURE){
          Notify.failure('Item edit failed!')
        }
      })
  }


  onSubmit() {
    console.log('submitted')
  }
}
