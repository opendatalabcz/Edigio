import {Component, Input} from '@angular/core';
import {distinctUntilChanged, Observable} from "rxjs";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

/**
 * Sidenav intended to be used when we need full-page content with sidenav
 */
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

  //Used string instead of number, so units can be described (px,em,rem...)
  @Input() sidenavWidth?: string
  @Input() sidenavMinWidth?: string
  @Input() sidenavMaxWidth?: string

  private _sidenavContentClasses: string[] = []

  get sidenavContentClasses() : string[] {
    return this._sidenavContentClasses;
  }

  @Input() set sidenavContentClasses(value: string[]) {
    this._sidenavContentClasses = value;
  }

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
    if(this.sidenavWidth === undefined && this.sidenavMinWidth === undefined && this.sidenavMaxWidth === undefined) {
      //When none of the properties mentioned in condition is set, sidenav should be initialized with default value
      this.sidenavWidth = '350px';
    }
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

  get sidenavMinWidthStyle() : {['min-width']: string} | {} {
    return this.sidenavMinWidth !== undefined ? {['min-width']: this.sidenavMaxWidth} : {}
  }

  get sidenavMaxWidthStyle() : {['max-width']: string} | {} {
    return this.sidenavMaxWidth !== undefined ? {['max-width']: this.sidenavMaxWidth} : {}
  }

  get sidenavWidthStyle() : {width: string} | {} {
    return this.sidenavWidth !== undefined ? {['width']: this.sidenavWidth} : {}
  }

  get sidenavFinalWidthStyles() : {width?: string; ['min-width']?: string; ['max-width']?: string;} {
    return this.sidenavWidth !== undefined
      ? this.sidenavWidthStyle : {...this.sidenavMinWidthStyle, ...this.sidenavMaxWidthStyle}
  }
}
