import {Component, Input} from '@angular/core';
import {distinctUntilChanged, Observable} from "rxjs";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-page-sidenav',
  templateUrl: './page-sidenav.component.html',
  styleUrls: ['./page-sidenav.component.scss']
})
export class PageSidenavComponent {
  private readonly breakpoint$: Observable<BreakpointState>
  public isSmallScreen = false
  /**
   * Indicator whether sidenav with filter is opened
   */
  isSidenavOpened = false;
  @Input() sidenavOpenIcon: string = 'menu';
  @Input() sidenavCloseIcon: string = 'close';

  constructor(private breakpointObserver: BreakpointObserver) {

    this.breakpoint$ = this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall]
      )
      .pipe(
        distinctUntilChanged(),
        untilDestroyed(this)
      )
  }

  ngOnInit() {
    this.breakpoint$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.onSizeChanges())
  }

  private onSizeChanges() {
    this.isSmallScreen = this.breakpointObserver
      .isMatched([
        Breakpoints.Small,
        Breakpoints.XSmall
      ])
    this.isSidenavOpened = !this.isSmallScreen
  }

  toggleSidenavOpened(): void {
    this.isSidenavOpened = !this.isSidenavOpened;
  }
}
