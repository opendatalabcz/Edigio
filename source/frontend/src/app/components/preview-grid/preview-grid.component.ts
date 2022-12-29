import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {GridItem} from "../../models/preview-grid/grid-item";
import {MatGridList} from "@angular/material/grid-list";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from "@angular/cdk/layout";
import {count, distinctUntilChanged, Observable} from "rxjs";
import {min} from "@popperjs/core/lib/utils/math";
import {ActivatedRoute} from "@angular/router";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {ProjectFilter} from "../../models/projects/project-filter";
@Component({
  selector: 'app-preview-grid',
  templateUrl: './preview-grid.component.html',
  styleUrls: ['./preview-grid.component.scss'],
})
export class PreviewGridComponent implements OnInit {
  @ViewChild('grid') grid?: MatGridList;

  private readonly breakpoint$: Observable<BreakpointState>

  /**
   * Items to be displayed on grid
   */
  @Input() public items: GridItem[] = [];

  /**
   * Multiplier for number of column
   *  -> size <= Small => columns = 1
   *  -> size == Medium => columns = multiplier.
   *  -> size > Medium => columns = 2 * multiplier
   */
  @Input() public multiplier: number = 3

  public columns?: number;

  /**
   * Maximum number of grid columns.
   *
   * Actual number is either this value or number computed
   * for current screen size (whichever is lower).
   */
  @Input() public maxColumns: number = Number.MAX_SAFE_INTEGER;

  filter: ProjectFilter = {}

  public isSmallScreen: boolean = false

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
    this.breakpoint$ = this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall ]
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
    //This flag is set only in 1 of 3 cases, so we first reset value back to false
    //This simplifies code a bit
    this.isSmallScreen = false
    if(this.breakpointObserver.isMatched([Breakpoints.Small, Breakpoints.XSmall])) {
      //More than one column will hardly fit for small devices
      this.columns = 1
      this.isSmallScreen = true
    } else if(this.breakpointObserver.isMatched([Breakpoints.Medium])) {
      this.columns = this.ceilColumnsCount(this.multiplier);
    } else {
      this.columns = this.ceilColumnsCount(this.multiplier * 2)
    }
  }

}

