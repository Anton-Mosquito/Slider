import {Routes} from '@angular/router';
import { SliderComponent } from './pages/slider-page/slider.component';

export const SliderRouting: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SliderComponent,
  },
];
