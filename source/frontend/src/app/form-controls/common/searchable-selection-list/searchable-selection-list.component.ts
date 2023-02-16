import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, debounce, debounceTime, map, Observable, Subject, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {requireNotNull, requireType} from "../../../utils/assertions/object-assertions";
import * as string_decoder from "string_decoder";
import {Nullable} from "../../../utils/types/common";
import {isArrayNullUndefinedOrEmpty} from "../../../utils/array-utils";

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
  @Output() select = new EventEmitter<T>()
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
        console.log('searchin...')
        this.search.emit(value)
      })
  }

  onSelect(optionData: Nullable<T>) {
    requireNotNull(optionData, 'Unexpected null option data!')
    //At this point it's (almost) safe to cast to type T, as item is surely not null
    this.select.emit(optionData as T)
  }

  onFilterChange(value: string) {
    this.filterValue$.next(value)
  }

  dataAreObservable(data: T[] | Observable<T[]>) : data is Observable<T[]> {
    return data instanceof Observable<T[]>
  }

  get observableData() : Observable<T[]> {
    if(!this.dataAreObservable(this.data)) {
      throw new Error('Data not observable!')
    }
    return this.data
  }

  get iterableData() : T[] {
    if(this.dataAreObservable(this.data)) {
      throw new Error('Data not observable!')
    }
    return this.data
  }

  observableDataValueString(value: T) : Observable<string> {
    const result = this.dataValueToString(value)
    if(typeof result === 'string') {
      throw new Error('ToStringFn not async!')
    }
    return result
  }

  nullableDataEmptyOrNull(data: Nullable<T[]>) : boolean {
    return isArrayNullUndefinedOrEmpty(data)
  }
}
