import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderBlockComponent } from './slider-block.component';

describe('SliderBlockComponent', () => {
  let component: SliderBlockComponent;
  let fixture: ComponentFixture<SliderBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
