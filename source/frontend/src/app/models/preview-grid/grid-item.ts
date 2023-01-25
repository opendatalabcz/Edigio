import {Observable} from "rxjs";

export interface GridItem {
  title: Observable<string>,
  text: Observable<string>,
  buttonsData: GridItemButtonData[]
  shareButtonsLink: string
}

export interface GridItemButtonData {
  text: Observable<string>,
  link: unknown[] | string
}
