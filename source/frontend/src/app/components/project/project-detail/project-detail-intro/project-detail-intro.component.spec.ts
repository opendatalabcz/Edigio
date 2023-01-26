import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailIntroComponent } from './project-detail-intro.component';

describe('ProjectDetailIntroComponent', () => {
  let component: ProjectDetailIntroComponent;
  let fixture: ComponentFixture<ProjectDetailIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailIntroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
