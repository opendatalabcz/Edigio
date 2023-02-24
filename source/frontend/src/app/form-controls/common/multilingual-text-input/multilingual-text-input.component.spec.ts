import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractMultilingualTextBasedInputComponent } from '../abstract-multilingual-text-based-input/abstract-multilingual-text-based-input.component';

describe('MultilingualTextInputComponent', () => {
  let component: AbstractMultilingualTextBasedInputComponent;
  let fixture: ComponentFixture<AbstractMultilingualTextBasedInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractMultilingualTextBasedInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractMultilingualTextBasedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
