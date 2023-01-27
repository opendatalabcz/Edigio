import { TestBed } from '@angular/core/testing';

import { MultilingualTextService } from './multilingual-text.service';

describe('LocalizationService', () => {
  let service: MultilingualTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultilingualTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
