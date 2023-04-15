import { TestBed } from '@angular/core/testing';

import { LoggedUserResolver } from './logged-user.resolver';

describe('LoggedUserResolver', () => {
  let resolver: LoggedUserResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LoggedUserResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
