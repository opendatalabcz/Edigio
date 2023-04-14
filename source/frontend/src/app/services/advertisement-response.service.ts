import {Injectable} from '@angular/core';
import {
  AdvertisementResponseCreateData,
  AdvertisementResponsePreview
} from "../models/advertisement/advertisement-response";
import {map, Observable, timer} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {
  ADVERTISEMENT_RESPONSE_CREATION_API_URL,
  advertisementResponsePreviewApiUrl
} from "../api-config/advertisement-response-api-config";
import {AdvertisementResponseConverter} from "../utils/convertors/advertisement-response-converter";
import {AdvertisementResponsePreviewDto} from "../dto/advertisement-response";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementResponseService {

  constructor(
    private advertisementResponseConverter: AdvertisementResponseConverter,
    private httpClient: HttpClient
  ) {
  }

  createNewResponse(response: AdvertisementResponseCreateData): Observable<string> {
    return this.httpClient.post<string>(
      ADVERTISEMENT_RESPONSE_CREATION_API_URL,
      this.advertisementResponseConverter.createDataToCreateDto(response)
    )
  }

  getPreviewById$(id: string, token?: string): Observable<AdvertisementResponsePreview> {
    return this.httpClient.get<AdvertisementResponsePreviewDto>(advertisementResponsePreviewApiUrl(id, token))
      .pipe(map((dto) => {
        return this.advertisementResponseConverter.previewDtoToPreviewModel(dto)
      }))
  }

  acceptWithToken$(responseId: string, token: string, note?: string): Observable<void> {
    //TODO: Implement this when authentication token is implemented
    return this.accept$(responseId, note)
  }

  accept$(responseId: string, note?: string): Observable<void> {
    return timer(200).pipe(map(() => {
    }))
  }

  rejectWithToken$(responseId: string, token: string, note?: string): Observable<void> {
    //TODO: Implement this when authentication token is implemented
    return this.reject$(responseId, note)
  }

  reject$(responseId: string, note?: string): Observable<void> {
    return timer(200).pipe(map(() => {
    }))
  }
}
