import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GridItem, GridItemButtonData} from "../../models/preview-grid/grid-item";
import {MatGridList} from "@angular/material/grid-list";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {distinctUntilChanged, Observable} from "rxjs";
import {min} from "@popperjs/core/lib/utils/math";
import {MultilingualText} from "../../models/common/multilingual-text";


/**
 * Class that allows viewing items in grid
 *
 * TODO: Right now alignment of items is to center, it would be great to allow setting alignment to top (or even bottom)
 *  Example use case might be important information page, where it would look much better if items were aligned to top
 *
 * TODO: Think about other ways of computing columns, it would make our grid more reusable,
 *  as right now columns count computation looks good only for components that take full size of page
 *  (or full-size - sidenav)
 *
 */
@Component({
  selector: 'app-preview-grid',
  templateUrl: './preview-grid.component.html',
  styleUrls: ['./preview-grid.component.scss'],
})
export class PreviewGridComponent implements OnInit {
  @ViewChild('grid') grid?: MatGridList;

  private readonly breakpoint$: Observable<BreakpointState>

  private _items: GridItem[] = []

  public get items() : GridItem[] {
    return this._items
  }

  /**
   * Items to be displayed on grid
   */
  @Input() public set items(values: GridItem[]) {
    values.forEach(item => {
      //Right now there's nothing more to check than validity of buttons data,
      // everything else shouldn't have dangerous values (absolutePath + link array for buttons)
      if(!this.buttonsDataValid(item.buttonsData)) {
        throw new Error('Invalid buttons data for item ' + item )
      }
    })
    this._items = values
  }

  private buttonsDataValid(buttonsData: GridItemButtonData[]) : boolean {
    return !buttonsData.find(data => data.isAbsolute && typeof data.link != 'string' )
  }


  /**
   * Multiplier for number of column
   *  -> size <= Small => columns = 1
   *  -> size == Medium => columns = multiplier.
   *  -> size > Medium => columns = 2 * multiplier
   */
  @Input() public multiplier = 3

  public columns?: number;

  /**
   * Maximum number of grid columns.
   *
   * Actual number is either this value or number computed
   * for current screen size (whichever is lower).
   */
  @Input() public maxColumns = Number.MAX_SAFE_INTEGER;

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpoint$ = this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall]
      )
      .pipe(distinctUntilChanged())
  }

  ngOnInit(): void {
    this.breakpoint$.subscribe(() => this.onSizeChanges())
  }

  private ceilColumnsCount(count: number) {
    return min(this.maxColumns, count)
  }

  private onSizeChanges() {
    //This flag is set only in 1 of 3 cases, so we first reset value back to false.
    //This simplifies code a bit.
    if (this.breakpointObserver.isMatched([
      Breakpoints.Small,
      Breakpoints.XSmall
    ])) {
      //More than one column will hardly fit for small devices
      this.columns = 1
    } else if (this.breakpointObserver.isMatched([Breakpoints.Medium])) {
      this.columns = this.ceilColumnsCount(this.multiplier);
    } else {
      this.columns = this.ceilColumnsCount(this.multiplier * 2)
    }
  }
}

