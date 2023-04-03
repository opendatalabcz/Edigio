import {Injectable} from '@angular/core';
import {
  AdvertisementResponse,
  AdvertisementResponseCreateData,
  AdvertisementResponseStatus
} from "../models/advertisement/advertisement-response";
import {map, Observable, timer} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MultilingualText} from "../models/common/multilingual-text";
import {AdvertisementType} from "../models/advertisement/advertisement";
import {ResourceService} from "./resource.service";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementResponseService {
  private mockedResponse : AdvertisementResponse = {
    responseId: 'onlyresponse',
    advertisement: {
      id: 'frstofr',
      title: MultilingualText.of({text: 'Špatně mockovaný text 1', languageCode: 'cs'}, {text: "Wrongly mocked text 1", languageCode: 'en'}),
      type: AdvertisementType.OFFER,
    },
    listedItems: [{
      resource: {
        id: 'megausefulthing',
        name: MultilingualText.of(
          {text: 'Nahodna vec', languageCode: 'cs'},
          {text: 'Random item', languageCode: 'en'}
        ),
      },
      description: 'Hodně poškozený, to vážně nechcete',
      amount: 2,
    }, {
      resource: {
        id: 'moremegausefulthing',
        name: MultilingualText.of(
          {text: 'Nahodnejsi vec', languageCode: 'cs'},
          {text: 'More random item', languageCode: 'en'}
        ),
      },
      description: 'Hodně poškozený, to vážně nechcete, ale jakože opravdu nechcete',
      amount: 2,
    }, {
      resource: {
        id: 'muchmoremegausefulthing',
        name: MultilingualText.of(
          {text: 'Mnohem nahodnejsi vec', languageCode: 'cs'},
          {text: 'Much more random item', languageCode: 'en'}
        ),
      },
      description: 'Když už byste vzali tamto, tohle nějak přežijete',
      amount: 2,
    }],
    responder: {
      id: 'userone',
      username: 'john.doe',
      firstname: 'johny',
      lastname: 'doe',
      email: 'john.doe@example.org',
      telephoneNumber: '+420777777777',
      avatarUrl: 'https://cdn.pixabay.com/photo/2022/10/31/20/27/lioness-7560708_960_720.jpg',
      spokenLanguages: [{name: 'Čeština', code: 'cs'}, {name: 'English', code: 'en'}]
    },
    creationDate: new Date(2023,2,12),
    status: AdvertisementResponseStatus.WAITING,
    note: 'Tady Vám z celého srdce nabízím vše co mám, tedy nic. Mohu kdykoliv, ale vlastně nikdy. Prosím, ozvěte se, nebo raději ne'
  }

  constructor(resourceService: ResourceService) {
  }

  createNewResponse(response: AdvertisementResponseCreateData) : Observable<void>{
    return timer(200).pipe(map(() => { throw new HttpErrorResponse({status: 404})}))
  }

  getByIdWithToken$(id: string, token: string) : Observable<AdvertisementResponse> {
    //TODO: Implement this when server side part is finished
    return timer(200).pipe(map(() => {
      if(+token >= 400) {
        throw new HttpErrorResponse({status: +token})
      }
      return this.mockedResponse
    }))
  }

  getById$(id: string) {
    return timer(200).pipe(map(() => {
      if(id !== 'onlyresponse') {
        throw new HttpErrorResponse({status: 404})
      }
      return this.mockedResponse
    }))
  }

  acceptWithToken$(responseId: string, token: string, note?: string) : Observable<void> {
    //TODO: Implement this when authentication token is implemented
    return this.accept$(responseId, note)
  }

  accept$(responseId: string, note? : string) : Observable<void> {
    return timer(200).pipe(map(() => {}))
  }

  rejectWithToken$(responseId: string, token: string, note?: string) : Observable<void> {
    //TODO: Implement this when authentication token is implemented
    return this.reject$(responseId, note)
  }

  reject$(responseId: string, note?: string) : Observable<void> {
    return timer(200).pipe(map(() => {}))
  }
}
