import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ListedItem} from "../../../models/advertisement/resource";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-listed-item-edit-dialog',
  templateUrl: './listed-item-edit-dialog.component.html',
  styleUrls: ['./listed-item-edit-dialog.component.scss']
})
export class ListedItemEditDialogComponent {
  private success: boolean = false
  private listedItem?: ListedItem
  private form: FormGroup

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<ListedItemEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: ListedItem,
  ) {
    this.listedItem = data
    this.form = this.createEditForm(fb)
  }

  private createEditForm(formBuilder: FormBuilder) :  FormGroup {
    return formBuilder.group({
      description: []
    })
  }
}
