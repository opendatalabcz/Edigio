import {UrlTree} from "@angular/router";

export interface GridItem {
  title: string,
  text: string,
  buttonsData: GridItemButtonData[]
}

export interface GridItemButtonData {
  text: string,
  link: any[] | string
}
