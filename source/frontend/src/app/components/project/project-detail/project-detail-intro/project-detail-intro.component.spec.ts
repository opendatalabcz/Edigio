import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailIntroComponent } from './project-detail-intro.component';
import {TranslateModule} from "@ngx-translate/core";
import {MultilingualTextToCurrentLanguagePipe} from "../../../../pipes/multilingual-text-to-current-language.pipe";
import {MultilingualTextTranslatePipe} from "../../../../pipes/multilingual-text-translate.pipe";

describe('ProjectDetailIntroComponent', () => {
  let component: ProjectDetailIntroComponent;
  let fixture: ComponentFixture<ProjectDetailIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailIntroComponent, MultilingualTextToCurrentLanguagePipe, MultilingualTextTranslatePipe ],
      imports: [TranslateModule.forRoot()]
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
