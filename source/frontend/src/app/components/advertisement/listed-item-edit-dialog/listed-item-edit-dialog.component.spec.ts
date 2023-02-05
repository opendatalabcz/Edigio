import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedItemEditDialogComponent } from './listed-item-edit-dialog.component';

describe('ListedItemEditDialogComponent', () => {
  let component: ListedItemEditDialogComponent;
  let fixture: ComponentFixture<ListedItemEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListedItemEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListedItemEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
