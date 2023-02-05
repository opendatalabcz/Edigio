import { Injectable } from '@angular/core';
import {Resource} from "../models/advertisement/resource";
import {MultilingualText} from "../models/common/multilingual-text";
import {map, Observable, tap, timer} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private resources: Resource[] = [
    {
      id: 'megausefulthing',
      name: MultilingualText.of(
        {text: 'Nahodna vec', lang: 'cs'},
        {text: 'Random item', lang: 'en'}
      ),
      description: MultilingualText.of(
        {text: 'Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec.', lang: 'cs'},
        {text: 'Mega useful random item', lang: 'cs'}
      ),
      galleryId: 'usefulthinggallery'
    }
  ]

  getAllResourcesByIds$(ids: string[]) : Observable<Resource[]> {
    return timer(300).pipe(map(() => this.resources.filter(res => ids.indexOf(res.id) >= 0)))
  }

  getById$(id: string) {
    return timer(300).pipe(
      map(() => this.resources.find(res => !res.id.localeCompare(id))),
      tap((resource) => {
        if(!resource) {
          throw new HttpErrorResponse({status: 404, statusText: id})
        }
      })
    )
  }
}
