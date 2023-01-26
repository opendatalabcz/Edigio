import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectImportantInformationComponent } from './project-important-information.component';

describe('ProjectImportantInformationComponent', () => {
  let component: ProjectImportantInformationComponent;
  let fixture: ComponentFixture<ProjectImportantInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectImportantInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectImportantInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
