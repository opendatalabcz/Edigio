import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AdvertisementType} from "../../models/advertisement/advertisement";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {PageRequest} from "../../models/pagination/page-request";
import {PageEvent} from "@angular/material/paginator";
import {SortDirection} from "../../models/common/sort-direction";
import {PageInfo} from "../../models/pagination/page";
import {requireAll, requireDefinedNotEmpty} from "../../utils/assertions/array-assertions";
import {AdvertisedItem} from "../../models/advertisement/advertised-item";
import {ResponseItem} from "../../models/advertisement/response-item";

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
  @Input() pageInfo: PageInfo = {idx: 0, size: 5, totalItemsAvailable: 0}

  private _pageSizes: number[] = [5, 10, 25, 50, 100]

  @Input() set pageSizes(sizes: number[]) {
    requireDefinedNotEmpty(sizes, 'Page sizes cannot be empty!')
    requireAll(sizes, Number.isInteger, 'Page sizes must be only integers!')
    this._pageSizes = sizes
  }

  get pageSizes() : number[] {
    return this._pageSizes
  }

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
    this.pageChange.emit({idx: event.pageIndex, size: event.pageSize})
  }
}
