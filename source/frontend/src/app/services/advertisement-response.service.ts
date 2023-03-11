import { Injectable } from '@angular/core';
import {AdvertisementResponse} from "../models/advertisement/advertisement-response";
import {map, Observable, timer} from "rxjs";
import {HttpErrorResponse, HttpResponse, HttpStatusCode} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementResponseService {
  createNewResponse(response: AdvertisementResponse) : Observable<void>{
    //Convert advertisement response to creation dto and send it over to server, then return status
    return timer(200).pipe(map(() => { throw new HttpErrorResponse({status: 404})}))
  }
}
