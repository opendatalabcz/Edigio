import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnownLanguageSelectionListComponent } from './known-language-selection-list.component';

describe('KnownLanguageSelectionListComponent', () => {
  let component: KnownLanguageSelectionListComponent;
  let fixture: ComponentFixture<KnownLanguageSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnownLanguageSelectionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnownLanguageSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
