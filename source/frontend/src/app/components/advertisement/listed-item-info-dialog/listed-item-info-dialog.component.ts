import {Component, Inject, OnInit} from '@angular/core';
import {ListedItem, Resource} from "../../../models/advertisement/resource";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../../services/notification.service";
import {ResourceService} from "../../../services/resource.service";
import {first} from "rxjs";

@Component({
  selector: 'app-listed-item-info-dialog',
  templateUrl: './listed-item-info-dialog.component.html',
  styleUrls: ['./listed-item-info-dialog.component.scss']
})
export class ListedItemInfoDialogComponent implements OnInit {
  resource?: Resource
  listedItem?: ListedItem

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ListedItemInfoDialogComponent>,
    private notificationService: NotificationService,
    private resourceService: ResourceService,
  ) {
  }

  ngOnInit() {
    this.notificationService.startLoading('')
    this.dialogRef.addPanelClass('d-none')
    if (!this.data) {
      this.notificationService.failure("NOTIFICATIONS.MISSING_DATA_ERROR", true)
      this.notificationService.stopLoading()
      this.dialogRef.close()
    }
    this.listedItem = this.data
    if (!this.listedItem?.resource) {
      this.notificationService.failure("NOTIFICATIONS.INVALID_DATA_ERROR", true)
      this.notificationService.stopLoading()
      this.dialogRef.close()
      return;
    }
    this.resourceService.getById$(this.listedItem.resource.id)
      .pipe(
        first()
      )
      .subscribe({
        next: (resource) => {
          this.resource = resource
          this.dialogRef.removePanelClass('d-none')
          this.notificationService.stopLoading()
        },
        error: (err) => {
          this.notificationService.failure("Resource retrieval error: " + err.statusText, true)
          this.notificationService.stopLoading()
          this.dialogRef.close()
        }
      })
  }
}
