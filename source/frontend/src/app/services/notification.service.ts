import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Confirm, Loading, Notify} from "notiflix";

export enum LoadingType {
  UNIVERSAL, LOADING, WAITING, PROCESSING,REFRESHING, TRANSMITING,
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _loadingAnimationRunning = false;
  private firstAnimationRun = false
  public get loadingAnimationRunning() {
    return this._loadingAnimationRunning
  }

  constructor(private translationService: TranslateService) { }

  private getActualMessage(message: string, translate: boolean) : string {
    if(translate) {
      //Little cheat, as on first load we don't have loading text translation ready
      //Therefore we start it outside, use english version, and add loading text for next re-runs
      return this.firstAnimationRun ? this.translationService.instant(message) : ''
    } else {
      return message
    }
  }

  public info(message: string, translate: boolean = false) {
    Notify.info(this.getActualMessage(message, translate))
  }

  public success(message: string, translate: boolean = false) {
    Notify.success(this.getActualMessage(message, translate))
  }

  public warning(message: string, translate: boolean = false) {
    Notify.warning(this.getActualMessage(message, translate))
  }

  public failure(message: string, translate: boolean = false) {
    Notify.failure(this.getActualMessage(message, translate))
  }

  public startLoading (
    message: string,
    translate: boolean = false,
    loadingType: LoadingType = LoadingType.UNIVERSAL
  ) : void {
    if(this.loadingAnimationRunning) {
      //When animation is not running, it's not safe to start it again
      throw new Error("Animation is already running!")
    }
    this._loadingAnimationRunning = true
    switch (loadingType) {
      case LoadingType.UNIVERSAL:
        Loading.standard(this.getActualMessage(message, translate))
        break;
      case LoadingType.LOADING:
        Loading.circle(this.getActualMessage(message, translate))
        break;
      case LoadingType.WAITING:
        Loading.hourglass(this.getActualMessage(message, translate))
        break;
      case LoadingType.PROCESSING:
        Loading.dots(this.getActualMessage(message, translate))
        break;
      case LoadingType.REFRESHING:
        Loading.arrows(this.getActualMessage(message, translate))
        break;
      case LoadingType.TRANSMITING:
        Loading.arrows(this.getActualMessage(message, translate))
        break;
      default:
        throw new Error("Unknown loading animation type given!")
    }
    this.firstAnimationRun = true;
  }

  public update_loading_message(message: string, translate: boolean) : void {
    if(this.loadingAnimationRunning) {
      //When animation is not running, it's not right to change the message
      //It's probably an error in logic, therefor I decided it's better to throw exception
      throw new Error("Cannot update loading message when animation is not running!")
    }
    Loading.change(this.getActualMessage(message, translate))
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
