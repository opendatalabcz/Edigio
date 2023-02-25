import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilingualTextareaComponent } from './multilingual-textarea.component';

describe('MultilingualTextareaComponent', () => {
  let component: MultilingualTextareaComponent;
  let fixture: ComponentFixture<MultilingualTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultilingualTextareaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultilingualTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
