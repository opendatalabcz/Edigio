import { Injectable } from '@angular/core';
import {Resource, ResourceShort} from "../models/advertisement/resource";
import {LocalizedText, MultilingualText} from "../models/common/multilingual-text";
import {map, Observable, tap, timer} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Page} from "../models/pagination/page";
import {PageRequest} from "../models/pagination/page-request";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private resources: Resource[] = [
    {
      id: 'megausefulthing',
      name: MultilingualText.of(
        {text: 'Nahodna vec', languageCode: 'cs'},
        {text: 'Random item', languageCode: 'en'}
      ),
      description: MultilingualText.of(
        {text: 'Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec.', languageCode: 'cs'},
        {text: 'Mega useful random item', languageCode: 'cs'}
      ),
      galleryId: 'usefulthinggallery'
    },
    {
      id: 'moremegausefulthing',
      name: MultilingualText.of(
        {text: 'Nahodnejsi vec', languageCode: 'cs'},
        {text: 'More random item', languageCode: 'en'}
      ),
      description: MultilingualText.of(
        {text: 'Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec.', languageCode: 'cs'},
        {text: 'Mega useful random item', languageCode: 'cs'}
      ),
      galleryId: 'usefulthinggallery'
    },
    {
      id: 'muchmoremegausefulthing',
      name: MultilingualText.of(
        {text: 'Mnohem nahodnejsi vec', languageCode: 'cs'},
        {text: 'Much more random item', languageCode: 'en'}
      ),
      description: MultilingualText.of(
        {text: 'Mnohem mega vice uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec. Mega uzitecna nahodna vec.', languageCode: 'cs'},
        {text: 'Much mega more useful random item', languageCode: 'cs'}
      ),
      galleryId: 'usefulthinggallery'
    }
  ]

  getAllResourcesByIds$(ids: string[]) : Observable<ResourceShort[]> {
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

  findPageByName(resourceNameText: LocalizedText) : Observable<ResourceShort[]> {
    return timer(200)
      .pipe(
        map(
          () => this.resources.filter(rsrc => rsrc.name.textWithSameLanguageOrDefaultContains(resourceNameText))
        )
      )
  }
}
