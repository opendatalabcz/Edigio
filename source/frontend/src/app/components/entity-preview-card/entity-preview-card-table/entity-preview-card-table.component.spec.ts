import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityPreviewCardTableComponent } from './entity-preview-card-table.component';

describe('RatedEntityPreviewCardTableComponent', () => {
  let component: EntityPreviewCardTableComponent;
  let fixture: ComponentFixture<EntityPreviewCardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityPreviewCardTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityPreviewCardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
