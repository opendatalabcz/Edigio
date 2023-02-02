import { Injectable } from '@angular/core';
import {Resource} from "../models/projects/advertisement/resource";
import {MultilingualText} from "../models/common/multilingual-text";
import {map, Observable, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  constructor() { }

  private resources: Resource[] = [
    {
      id: 'megausefulthing',
      name: MultilingualText.of(
        {text: 'Nahodna vec', lang: 'cs'},
        {text: 'Random item dsoklůfbojůfbuijkfdbjkfdbklůfdyblijkhjlftdrsbhjvftdrguijk', lang: 'en'}
      ),
      description: MultilingualText.of(
        {text: 'Mega uzitecna nahodna vec', lang: 'cs'},
        {text: 'Mega useful random item', lang: 'cs'}
      ),
      galleryId: 'usefulthinggallery'
    }
  ]

  getAllResourcesByIds$(ids: string[]) : Observable<Resource[]> {
    return timer(300).pipe(map(() => this.resources.filter(res => ids.indexOf(res.id) >= 0)))
  }
}
