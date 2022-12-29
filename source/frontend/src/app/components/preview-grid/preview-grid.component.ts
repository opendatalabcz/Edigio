import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {GridItem} from "../../models/GridItem";
import {MatGridList} from "@angular/material/grid-list";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from "@angular/cdk/layout";
import {count, distinctUntilChanged, Observable} from "rxjs";
import {min} from "@popperjs/core/lib/utils/math";
import {ActivatedRoute} from "@angular/router";
import {ProjectsUiService} from "../../ui/projects-ui.service";
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


  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private projectsUiService: ProjectsUiService
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
    let project = this.projectsUiService.getCurrentProjectFromRoute(
      this.activatedRoute
    )
    console.debug(project)
  }

  private ceilColumnsCount(count: number) {
    return min(this.maxColumns, count)
  }

  private onSizeChanges() {
    if(this.breakpointObserver.isMatched([Breakpoints.Small, Breakpoints.XSmall])) {
      //More than one column will hardly fit for small devices,
      // so we will
      this.columns = 1
    } else if(this.breakpointObserver.isMatched([Breakpoints.Medium])) {
      this.columns = this.ceilColumnsCount(this.multiplier);
    } else {
      this.columns = this.ceilColumnsCount(this.multiplier * 2)
    }
  }

}

