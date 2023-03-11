import { TestBed } from '@angular/core/testing';

import { AdvertisementResponseService } from './advertisement-response.service';

describe('AdvertisementResponseService', () => {
  let service: AdvertisementResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvertisementResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
