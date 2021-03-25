import {Routes} from '@angular/router';

export const WebsiteRouting: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: ()=> import('./slider/slider.module').then( module => module.SliderModule)
  },
];
