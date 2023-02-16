import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, debounce, debounceTime, map, Observable, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {requireType} from "../../../utils/assertions/object-assertions";
import * as string_decoder from "string_decoder";

@UntilDestroy()
@Component({
  selector: 'app-searchable-selection-list',
  templateUrl: './searchable-selection-list.component.html',
  styleUrls: ['./searchable-selection-list.component.scss']
})
export class SearchableSelectionListComponent<T> implements OnInit {
  @Input() data: T[] | Observable<T[]> = []
  @Input() isLoading = false
  @Input() dataValueToString: (value: T) => string | Observable<string> = (value: T) => String(value)
  @Input() toStringFnAsync = false
  @Output() select = new EventEmitter<T>()
  @Output() search = new EventEmitter<string>()

  filterValue: string = ''
  filterValue$: BehaviorSubject<string> = new BehaviorSubject(this.filterValue)

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

  onSelect(optionData: T | null) {
    console.log(optionData)
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
}
