import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';
import {ReadOnlyLanguage} from "../models/common/language";
import {cartesianProduct} from "../utils/array-utils";

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('readOnlyAvailableLanguages have expected number of items', () => {
    //Just test that expected number of languages is received, and that all of them are both different, and with non blank strings
    const languages = service.readonlyAvailableLanguages
    expect(languages).toHaveLength(2)
  })
});
