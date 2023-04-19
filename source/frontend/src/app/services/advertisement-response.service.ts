import {Injectable} from '@angular/core';
import {
  AdvertisementResponseCreateData,
  AdvertisementResponsePreview
} from "../models/advertisement/advertisement-response";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {
  ADVERTISEMENT_RESPONSE_CREATION_API_URL,
  advertisementResponseAcceptApiUrl,
  advertisementResponsePreviewApiUrl,
  advertisementResponseRejectApiUrl
} from "../api-config/advertisement-response-api-config";
import {AdvertisementResponseConverter} from "../shared/convertors/advertisement-response-converter";
import {AdvertisementResponsePreviewDto, AdvertisementResponseResolveDataDto} from "../dto/advertisement-response";
import {Nullable} from "../shared/types/common";

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

  acceptWithToken$(responseId: string, token: Nullable<string>, note?: string): Observable<void> {
    return this.httpClient.post<void>(
      advertisementResponseAcceptApiUrl(responseId),
      <AdvertisementResponseResolveDataDto>{
        token: token,
        note: note
      }
    )
  }

  rejectWithToken$(responseId: string, token: Nullable<string>, note?: string): Observable<void> {
    return this.httpClient.post<void>(
      advertisementResponseRejectApiUrl(responseId),
      <AdvertisementResponseResolveDataDto>{
        token: token,
        note: note
      }
    )
  }
}
