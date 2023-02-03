import {Observable} from "rxjs";
import {Link} from "../common/link";

/**
 * Item used by PreviewGrid
 */
export interface GridItem {
  title: Observable<string>,
  text: Observable<string>,
  buttonsData: GridItemButtonData[]
  shareButtonsLink?: string
}

/**
 * Data for single button displayed in grid item footer
 */
export interface GridItemButtonData {
  text: Observable<string>,
  link: Link
}
