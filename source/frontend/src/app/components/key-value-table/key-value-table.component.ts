import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ResourceBasedListedItem} from "../../models/advertisement/resource";
import {AdvertisedItem, AdvertisementType, ResponseItem} from "../../models/advertisement/advertisement";
import {MatDialog} from "@angular/material/dialog";

export type ListedItem = AdvertisedItem | ResponseItem

@Component({
  selector: 'app-key-value-table',
  templateUrl: './key-value-table.component.html',
  styleUrls: ['./key-value-table.component.scss']
})
export class KeyValueTableComponent<T extends ListedItem> {

  private _listedItems: T[] = [];

  @Input() set listedItems(items: T[]) {
    this._listedItems = items
  }

  get listedItems(): T[] {
    return this._listedItems;
  }

  @Input() advertisementType?: AdvertisementType
  @Output() resourceNameClick = new EventEmitter<T>()
  @Output() delete = new EventEmitter<T>()
  @Output() edit = new EventEmitter<T>()

  @Input() trackFn: (index: number, listedItem: ListedItem) => any
    = (_index, listedItem) => {
    //By default we can't do more than identity tracking
    return listedItem
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
}
