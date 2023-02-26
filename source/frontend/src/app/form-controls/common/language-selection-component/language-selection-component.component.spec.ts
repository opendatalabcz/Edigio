import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSelectionComponentComponent } from './language-selection-component.component';

describe('LanguageSelectionComponentComponent', () => {
  let component: LanguageSelectionComponentComponent;
  let fixture: ComponentFixture<LanguageSelectionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageSelectionComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSelectionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
