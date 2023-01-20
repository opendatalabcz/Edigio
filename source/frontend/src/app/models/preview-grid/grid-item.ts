import {Observable} from "rxjs";

export interface GridItem {
  title: Observable<string>,
  text: Observable<string>,
  buttonsData: GridItemButtonData[]
}

export interface GridItemButtonData {
  text: Observable<string>,
  link: unknown[] | string
}
