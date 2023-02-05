import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdvertisementResponse} from "../../../models/advertisement/advertisement-response";
import {personNamePartValidator, phoneNumberValidator} from "../../../validators/contact-validators";
import {ListedItem} from "../../../models/advertisement/resource";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {oppositeAdvertisementType} from "../../../utils/advertisement-utils";
import {MultilingualText} from "../../../models/common/multilingual-text";
import {MatInput} from "@angular/material/input";

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

  constructor(private fb: FormBuilder) {
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

  private editListedItem(listedItem: ListedItem): ListedItem {
    return listedItem
  }

  onListedItemEdit(itemToEdit: ListedItem) {
    const editedItem = this.editListedItem(itemToEdit)
    this.listedItems = this.listedItems.map(
      //Replace edited item and keep the rest
      item => item.id === itemToEdit.id ? editedItem : item
    )
  }

  onSubmit(form: FormGroup) {
    console.log('submitted')
  }
}
