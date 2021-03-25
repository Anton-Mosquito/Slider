import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SliderComponent } from './pages/slider-page/slider.component';
import { SliderRouting } from './slider.routing';
import { SliderBlockModule } from '../view/slider-block/slider-block.module';



@NgModule({
  declarations: [SliderComponent],
  imports: [
    CommonModule,
    SliderBlockModule,
    RouterModule.forChild(SliderRouting)
  ]
})
export class SliderModule { }
