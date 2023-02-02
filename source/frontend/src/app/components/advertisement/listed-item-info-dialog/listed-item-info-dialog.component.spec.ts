import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedItemInfoDialogComponent } from './listed-item-info-dialog.component';

describe('ListedItemInfoDialogComponent', () => {
  let component: ListedItemInfoDialogComponent;
  let fixture: ComponentFixture<ListedItemInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListedItemInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListedItemInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
