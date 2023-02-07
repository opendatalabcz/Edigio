import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DataSource} from "@angular/cdk/collections";
import {ListedItem} from "../../../models/advertisement/resource";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {ListedItemInfoDialogComponent} from "../listed-item-info-dialog/listed-item-info-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-listed-items-table',
  templateUrl: './listed-items-table.component.html',
  styleUrls: ['./listed-items-table.component.scss']
})
export class ListedItemsTableComponent {
  private _listedItems?: ListedItem[];

  @Input() set listedItems(items: ListedItem[]) {
    this._listedItems = items
    this.listedItemsDataSource = new MatTableDataSource(items)
    this.listedItemsDataSource.sort = this.sort ?? null;
  }


  @Input() advertisementType?: AdvertisementType

  @Output() delete = new EventEmitter<ListedItem>()

  @Output() edit = new EventEmitter<ListedItem>()

  listedItemsDataSource?: MatTableDataSource<ListedItem>
  @ViewChild(MatSort) sort?: MatSort;

  constructor(private matDialog: MatDialog) {}

  get listedItemNameHeaderColumnKey() {
    return this.advertisementType
      ? `LISTED_ITEMS_TABLE.${this.advertisementType.toUpperCase()}ED_ITEM_NAME` : ''
  }

  openListedItemDialog(listedItem: ListedItem) {
    this.matDialog.open(ListedItemInfoDialogComponent, {data: listedItem})
  }

  get editEnabled() : boolean {
    return this.edit.observed
  }

  get deleteEnabled() : boolean {
    return this.delete.observed
  }

  get displayActionsColumn() : boolean {
    return this.editEnabled || this.deleteEnabled
  }

  get availableColumns(): string[] {
    return ['name', 'amount', ...(this.displayActionsColumn ? ['actions'] : [])]
  }

  onEdit(item: ListedItem) {
    this.edit.emit(item)
  }

  onDelete(item: ListedItem) {
    this.delete.emit(item)
  }

  trackFn(index: number, listedItem: ListedItem) {
    return listedItem.id
  }
}
