import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseItemEditDialogComponent } from './response-item-edit-dialog.component';

describe('ListedItemEditDialogComponent', () => {
  let component: ResponseItemEditDialogComponent;
  let fixture: ComponentFixture<ResponseItemEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseItemEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseItemEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
