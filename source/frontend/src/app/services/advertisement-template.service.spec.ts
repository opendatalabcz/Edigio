import { TestBed } from '@angular/core/testing';

import { AdvertisementTemplateService } from './advertisement-template.service';

describe('AdvertisementTemplateService', () => {
  let service: AdvertisementTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvertisementTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
