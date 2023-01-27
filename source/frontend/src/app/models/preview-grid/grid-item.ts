import {Observable} from "rxjs";

export interface GridItem {
  title: Observable<string>,
  text: Observable<string>,
  buttonsData: GridItemButtonData[]
  shareButtonsLink?: string
}

export interface GridItemButtonData {
  text: Observable<string>,
  link: unknown[] | string,
  //Indicator whether link is to some absolute path, or path inside our app
  //When path is absolute, string should be
  isAbsolute: boolean
}
