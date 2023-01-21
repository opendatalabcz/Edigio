import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Loading, Notify} from "notiflix";

export enum LoadingType {
  UNIVERSAL, LOADING, WAITING, PROCESSING,REFRESHING, TRANSMITING,
}

@Injectable({
  providedIn: 'root'
})
export class NotifactionService {
  private _loadingAnimationRunning = false;
  public get loadingAnimationRunning() {
    return this._loadingAnimationRunning
  }

  constructor(private translationService: TranslateService) { }

  private getActualMessage(message: string, translate: boolean) {
    return translate ? this.translationService.instant(message) : message
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

  public start_loading(message: string, translate: boolean = false, loadingType: LoadingType = LoadingType.UNIVERSAL) : void {
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
  }

  public update_loading_message(message: string, translate: boolean) : void {
    if(this.loadingAnimationRunning) {
      //When animation is not running, it's not right to change the message
      //It's probably an error in logic, therefor I decided it's better to throw exception
      throw new Error("Cannot update loading message when animation is not running!")
    }
    Loading.change(this.getActualMessage(message, translate))
  }

  public stop_loading() : void {
    //I can't see anything wrong about stopping animation that's already stopped, so it's probably safe to ignore it
    this._loadingAnimationRunning = false
    Loading.remove()
  }
}
