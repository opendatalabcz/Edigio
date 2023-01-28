import { Injectable } from '@angular/core';
import {AppGallery, AppImage} from "../models/common/gallery";
import {MultilingualText} from "../models/common/multilingual-text";
import {interval, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  private galleries: AppGallery[] = [{
      title: MultilingualText.of({text: 'Universal intro gallery', lang: 'en'}),
      description: MultilingualText.of({text: 'Universally usable intro gallery', lang: 'en'}),
      slug: 'universal-intro-gallery',
      creationDate: new Date(1970,5,5),
      createdById: 1,
  }]

  private galleriesImages: {gallerySlug: string, images: AppImage[]}[] = [
    {gallerySlug: 'universal-intro-gallery', images: [
        {
          previewUrl: '/src/assets/dev/test-images/testimg1.png',
          itemUrl: '/assets/dev/test-images/testimg1.png',
          description: 'hello-there',
          title: 'take-a-seat',
          createdById: 1,
          creationDate: new Date(1970,9,6),
        },{
          previewUrl: '/src/assets/dev/test-images/testimg1.png',
          itemUrl: '/assets/dev/test-images/testimg1.png',
          description: 'hello-there',
          title: 'take-a-seat',
          createdById: 1,
          creationDate: new Date(1970,9,6),
        },{
          previewUrl: '/src/assets/dev/test-images/testimg1.png',
          itemUrl: '/assets/dev/test-images/testimg1.png',
          description: 'hello-there',
          title: 'take-a-seat',
          createdById: 1,
          creationDate: new Date(1970,9,6),
        },{
          previewUrl: '/src/assets/dev/test-images/testimg1.png',
          itemUrl: '/assets/dev/test-images/testimg1.png',
          description: 'hello-there',
          title: 'take-a-seat',
          createdById: 1,
          creationDate: new Date(1970,9,6),
        },{
          previewUrl: '/src/assets/dev/test-images/testimg1.png',
          itemUrl: '/assets/dev/test-images/testimg1.png',
          description: 'hello-there',
          title: 'take-a-seat',
          createdById: 1,
          creationDate: new Date(1970,9,6),
        },{
          previewUrl: '/src/assets/dev/test-images/testimg1.png',
          itemUrl: '/assets/dev/test-images/testimg1.png',
          description: 'hello-there',
          title: 'take-a-seat',
          createdById: 1,
          creationDate: new Date(1970,9,6),
        }
      ]
    }
  ]

  public getBySlug(slug: string) : Observable<AppGallery | undefined> {
    return of(this.galleries.find(galleryData => galleryData.slug == slug))
  }

  public getImagesBySlug(slug: string) : Observable<AppImage[]>{
    return interval(25000).pipe(
      map(() => this.galleriesImages
        .find(galleryImages => galleryImages.gallerySlug.localeCompare(slug) == 0)?.images ?? [])
    )
  }
}
