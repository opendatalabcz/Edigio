import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableSelectionListComponent } from './searchable-selection-list.component';

describe('SearchableSelectionListComponent', () => {
  let component: SearchableSelectionListComponent<any>;
  let fixture: ComponentFixture<SearchableSelectionListComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchableSelectionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchableSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
