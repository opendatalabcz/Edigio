import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseItemInfoDialogComponent } from './response-item-info-dialog.component';

describe('ListedItemInfoDialogComponent', () => {
  let component: ResponseItemInfoDialogComponent;
  let fixture: ComponentFixture<ResponseItemInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseItemInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseItemInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
