import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {debounceTime, Observable, Subject} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {requireNotNull, requireType} from "../../../shared/assertions/object-assertions";
import {Nullable} from "../../../shared/types/common";
import {isArrayNullUndefinedOrEmpty} from "../../../shared/utils/array-utils";

@UntilDestroy()
@Component({
  selector: 'app-searchable-selection-list',
  templateUrl: './searchable-selection-list.component.html',
  styleUrls: ['./searchable-selection-list.component.scss']
})
export class SearchableSelectionListComponent<T> implements OnInit {
  @Input() data: T[] | Observable<T[]> = []
  @Input() isLoading = true
  @Input() dataValueToString: (value: T) => string | Observable<string> = (value: T) => String(value)
  @Input() toStringFnAsync = false
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() placeholder: string = ''
  @Input() emptyListMessage: string = 'Sorry, nothing to show you';
  @Output() itemSelect = new EventEmitter<T>()
  @Output() search = new EventEmitter<string>()

  filterValue: string = ''
  filterValue$: Subject<string> = new Subject()

  ngOnInit(): void {
    this.filterValue$
      .pipe(
        debounceTime(200),
        untilDestroyed(this)
      )
      .subscribe((value: string) => {
        requireType(value, 'string')
        this.search.emit(value)
      })
  }

  onSelect(optionData: Nullable<T>) {
    requireNotNull(optionData, 'Unexpected null option data!')
    //At this point it's (almost) safe to cast to type T, as item is surely not null
    this.itemSelect.emit(optionData as T)
  }

  onFilterChange(value: string) {
    this.filterValue$.next(value)
  }

  dataAreObservable(data: T[] | Observable<T[]>): data is Observable<T[]> {
    return data instanceof Observable<T[]>
  }

  get observableData(): Observable<T[]> {
    if (!this.dataAreObservable(this.data)) {
      throw new Error('Data not observable!')
    }
    return this.data
  }

  get iterableData(): T[] {
    if (this.dataAreObservable(this.data)) {
      throw new Error('Data not observable!')
    }
    return this.data
  }

  observableDataValueString(value: T): Observable<string> {
    const result = this.dataValueToString(value)
    if (typeof result === 'string') {
      throw new Error('ToStringFn not async!')
    }
    return result
  }

  nullableDataEmptyOrNull(data: Nullable<T[]>): boolean {
    return isArrayNullUndefinedOrEmpty(data)
  }

  clearSearch() {
    this.filterValue = ''
    this.filterValue$.next('')
  }
}
