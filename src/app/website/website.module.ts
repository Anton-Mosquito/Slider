import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebsiteRouting } from './website.routing';
import { SliderModule } from './slider/slider.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(WebsiteRouting),
    SliderModule
  ]
})
export class WebsiteModule { }
