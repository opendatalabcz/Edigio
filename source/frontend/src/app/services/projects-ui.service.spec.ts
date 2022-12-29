import { TestBed } from '@angular/core/testing';

import { ProjectsUiService } from './projects-ui.service';

describe('ProjectsUiService', () => {
  let service: ProjectsUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
