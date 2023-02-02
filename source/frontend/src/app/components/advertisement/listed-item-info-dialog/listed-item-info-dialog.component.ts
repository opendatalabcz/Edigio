import {Component, Inject, OnInit} from '@angular/core';
import {ListedItem} from "../../../models/projects/advertisement/resource";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../../services/notification.service";
import {translate} from "@angular/localize/tools";
import {MultilingualText} from "../../../models/common/multilingual-text";

@Component({
  selector: 'app-listed-item-info-dialog',
  templateUrl: './listed-item-info-dialog.component.html',
  styleUrls: ['./listed-item-info-dialog.component.scss']
})
export class ListedItemInfoDialogComponent implements OnInit {
  listedItem?: ListedItem

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ListedItemInfoDialogComponent>,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    if(!this.data) {
      this.notificationService.failure("NOTIFICATIONS.MISSING_DATA_ERROR", true)
      this.dialogRef.close()
    }
    this.listedItem = this.data
  }
}
