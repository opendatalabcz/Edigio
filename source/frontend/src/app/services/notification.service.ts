import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Confirm, Loading, Notify} from "notiflix";
import {first, Observable} from "rxjs";

//TODO: Refactor methods, so they use object like NotificationData instead of separate parameters

export enum LoadingType {
  UNIVERSAL, LOADING, WAITING, PROCESSING,REFRESHING, TRANSMITING,
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _loadingAnimationRunning = false;
  private firstTranslationRetrieved = false
  public get loadingAnimationRunning() {
    return this._loadingAnimationRunning
  }

  constructor(private translationService: TranslateService) {
    console.log('Contructed')
  }

  private getActualMessage(message: string, translate: boolean, translationParams?: Object) : string {
    this.firstTranslationRetrieved = this.firstTranslationRetrieved || translate
    return translate ? this.translationService.instant(message, translationParams) : message
  }

  public info(message: string, translate: boolean = false, translationParams?: object) {
    Notify.info(this.getActualMessage(message, translate, translationParams))
  }

  public success(message: string, translate: boolean = false, translationParams?: object) {
    Notify.success(this.getActualMessage(message, translate, translationParams))
  }

  public warning(message: string, translate: boolean = false, translationParams?: object) {
    Notify.warning(this.getActualMessage(message, translate, translationParams))
  }

  public failure(message: string, translate: boolean = false, translationParams?: object) {
    Notify.failure(this.getActualMessage(message, translate, translationParams))
  }

  private checkAndSetupLoadingStartPreconditions() {
    if(this.loadingAnimationRunning) {
      //When animation is not running, it's not safe to start it again
      throw new Error("Animation is already running!")
    }
    this._loadingAnimationRunning = true
  }

  private getLoadingMessageAndPrepareTranslation(message: string, translate: boolean) {
    let actualMessage = '';
    console.dir([this.firstTranslationRetrieved, !translate])
    if(this.firstTranslationRetrieved || !translate) {
      console.log('Instant translate of loading')
      actualMessage = this.getActualMessage(message, translate)
    } else if(translate) {
      this.translationService.stream(message)
        .pipe(first())
        .subscribe(transation => {
          this.firstTranslationRetrieved = true
          if(this._loadingAnimationRunning) {
            Loading.change(transation)
          }
        })
    }
    return actualMessage
  }

  public startLoading (
    message: string,
    translate: boolean = false,
    loadingType: LoadingType = LoadingType.UNIVERSAL
  ) : void {
    this.checkAndSetupLoadingStartPreconditions()
    const actualMessage = this.getLoadingMessageAndPrepareTranslation(message, translate)
    switch (loadingType) {
      case LoadingType.UNIVERSAL:
        Loading.standard(actualMessage)
        break;
      case LoadingType.LOADING:
        Loading.circle(actualMessage)
        break;
      case LoadingType.WAITING:
        Loading.hourglass(actualMessage)
        break;
      case LoadingType.PROCESSING:
        Loading.dots(actualMessage)
        break;
      case LoadingType.REFRESHING:
        Loading.arrows(actualMessage)
        break;
      case LoadingType.TRANSMITING:
        Loading.arrows(actualMessage)
        break;
      default:
        throw new Error("Unknown loading animation type given!")
    }
  }

  public stopLoading() : void {
    //I can't see anything wrong about stopping animation that's already stopped, so it's probably safe to ignore it
    this._loadingAnimationRunning = false
    Loading.remove()
  }

  confirm(title: string,
          message: string,
          okButtonText: string,
          cancelButtonText: string,
          translate: boolean = false,
          okButtonCallback?: (() => void),
          cancelButtonCallback?: (() => void)
  ) {
    Confirm.show(
      this.getActualMessage(title, translate),
      this.getActualMessage(message, translate),
      this.getActualMessage(okButtonText, translate),
      this.getActualMessage(cancelButtonText, translate),
      okButtonCallback,
      cancelButtonCallback
    )
  }
}
