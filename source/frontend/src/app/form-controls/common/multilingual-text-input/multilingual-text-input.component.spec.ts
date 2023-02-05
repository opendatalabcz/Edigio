import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilingualTextInputComponent } from './multilingual-text-input.component';

describe('MultilingualTextInputComponent', () => {
  let component: MultilingualTextInputComponent;
  let fixture: ComponentFixture<MultilingualTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultilingualTextInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultilingualTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
