import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedItemsTableComponent } from './listed-items-table.component';

describe('ListedItemsTableComponent', () => {
  let component: ListedItemsTableComponent;
  let fixture: ComponentFixture<ListedItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListedItemsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListedItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
