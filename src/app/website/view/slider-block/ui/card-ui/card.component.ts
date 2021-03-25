import { Component, Input } from '@angular/core';
import { IUser } from 'src/app/website/slider/models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent{
  @Input('data') data : IUser = {}
}
