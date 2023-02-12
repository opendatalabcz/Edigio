import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AdvertisedItem, AdvertisementType, ResponseItem} from "../../models/advertisement/advertisement";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {PageRequest} from "../../models/pagination/page-request";
import {PageEvent} from "@angular/material/paginator";
import {SortDirection} from "../../models/common/sort-direction";
import {PageInfo} from "../../models/pagination/page";

export type ListedItem = AdvertisedItem | ResponseItem

@Component({
  selector: 'app-key-value-table',
  templateUrl: './key-value-table.component.html',
  styleUrls: ['./key-value-table.component.scss']
})
export class KeyValueTableComponent<T extends ListedItem> {

  @Input() listedItems$: T[] | Observable<T[]> = [];
  @Output() add: EventEmitter<void> = new EventEmitter<void>();

  @Input() advertisementType?: AdvertisementType
  @Output() resourceNameClick = new EventEmitter<T>()
  @Output() delete = new EventEmitter<T>()
  @Output() edit = new EventEmitter<T>()
  @Input() pageInfo: PageInfo = {num: 1, size: 1, lastPage: 1, sortDirection: SortDirection.ASCENDING}

  @Input() trackFn: (index: number, listedItem: ListedItem) => any
    = (_index, listedItem) => {
    //By default we can't do more than identity tracking
    return listedItem
  }

  @Output() pageChange: EventEmitter<PageRequest> = new EventEmitter<PageRequest>()

  get addEnabled(): boolean {
    return this.add.observed
  }

  constructor(private matDialog: MatDialog) {
  }

  get listedItemNameHeaderColumnKey() {
    return this.advertisementType
      ? `LISTED_ITEMS_TABLE.${this.advertisementType.toUpperCase()}ED_ITEM_NAME` : ''
  }

  get editEnabled(): boolean {
    return this.edit.observed
  }

  get deleteEnabled(): boolean {
    return this.delete.observed
  }

  get displayActionsColumn(): boolean {
    return this.editEnabled || this.deleteEnabled
  }

  get availableColumns(): string[] {
    return ['name', 'amount', ...(this.displayActionsColumn ? ['actions'] : [])]
  }

  onEdit(item: T) {
    this.edit.emit(item)
  }

  onDelete(item: T) {
    this.delete.emit(item)
  }

  onResourceNameClick(item: T) {
    this.resourceNameClick.emit(item)
  }

  onAdd() {
    this.add.emit()
  }

  onPageChanged(event: PageEvent) {
    this.pageChange.emit({num: event.pageIndex + 1, size: event.pageSize, sortDirection: SortDirection.ASCENDING})
  }
}
