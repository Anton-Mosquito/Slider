import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderBlockComponent } from './block/slider-block/slider-block.component';
import { SliderUiComponent } from './ui/slider-ui/slider-ui.component';
import { CardComponent } from './ui/card-ui/card.component';



@NgModule({
  declarations: [SliderBlockComponent, SliderUiComponent, CardComponent],
  imports: [
    CommonModule
  ],
  exports: [SliderBlockComponent]
})
export class SliderBlockModule { }
