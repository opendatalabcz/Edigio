import {MatPaginatorIntl} from "@angular/material/paginator";
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {combineLatest} from "rxjs";
import {getPageFirstIndex, getPageLastIndex, getTotalPagesNumber} from "../page-utils";

@UntilDestroy()
@Injectable()
export class NgxTranslateMatPaginatorIntl extends MatPaginatorIntl {
  private nothingToDisplayLabel: string = '';
  private pageLabel: string = ''
  constructor(private translateService: TranslateService) {
    super();
    combineLatest([
      this.translateService.stream("PAGINATOR.ITEMS_PER_PAGE_LABEL"),
      this.translateService.stream("PAGINATOR.NEXT_PAGE_LABEL"),
      this.translateService.stream("PAGINATOR.PREVIOUS_PAGE_LABEL"),
      this.translateService.stream("PAGINATOR.NOTHING_TO_DISPLAY_LABEL"),
      this.translateService.stream("PAGINATOR.PAGE_LABEL"),
    ]).pipe(untilDestroyed(this),)
      .subscribe((translations) => {
        [this.itemsPerPageLabel, this.nextPageLabel, this.previousPageLabel, this.nothingToDisplayLabel, this.pageLabel]
          = translations
        this.changes.next();
      })
  }

  override getRangeLabel = (pageIdx: number, pageSize: number, length: number) => {
    length = Math.max(length, 0);
    if(!length) {
      return this.nothingToDisplayLabel
    }
    const pageInfo = {idx: pageIdx, size: pageSize, totalItemsAvailable: length}
    return `${this.pageLabel} ${pageIdx + 1} / ${getTotalPagesNumber(pageInfo)}`;
  }
}
