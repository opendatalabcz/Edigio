import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdvertisementListedItemsComponent } from './create-advertisement-listed-items.component';

describe('CreateAdvertisementListedItemsComponent', () => {
  let component: CreateAdvertisementListedItemsComponent;
  let fixture: ComponentFixture<CreateAdvertisementListedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAdvertisementListedItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAdvertisementListedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
