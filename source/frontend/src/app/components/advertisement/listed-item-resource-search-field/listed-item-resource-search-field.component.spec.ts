import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedItemResourceSearchFieldComponent } from './listed-item-resource-search-field.component';

describe('ListedItemResourceSearchFieldComponent', () => {
  let component: ListedItemResourceSearchFieldComponent;
  let fixture: ComponentFixture<ListedItemResourceSearchFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListedItemResourceSearchFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListedItemResourceSearchFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
