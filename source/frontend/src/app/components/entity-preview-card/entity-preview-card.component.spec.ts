import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityPreviewCardComponent } from './entity-preview-card.component';

describe('RatedEntityPreviewCardComponent', () => {
  let component: EntityPreviewCardComponent;
  let fixture: ComponentFixture<EntityPreviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityPreviewCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
