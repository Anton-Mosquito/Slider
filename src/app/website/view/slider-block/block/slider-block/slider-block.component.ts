import { Component, OnInit } from '@angular/core';
import { IConfig } from 'src/app/website/slider/models';

@Component({
  selector: 'app-slider-block',
  templateUrl: './slider-block.component.html',
  styleUrls: ['./slider-block.component.css']
})
export class SliderBlockComponent implements OnInit {

  mainConfig: Array<IConfig> = [
    {
      type: 'image',
      loop: true,
      autoplay: true,
      interval: 2000,
      pauseOnHover: true,
      refresh: true,
      swipe: true,
      data: [
        './assets/picture/pexels-aleksandar-pasaric-325185.jpg',
        './assets/picture/pexels-cátia-matos-1072179.jpg',
        './assets/picture/pexels-eberhard-grossgasteiger-844297.jpg',
        './assets/picture/pexels-eberhard-grossgasteiger-1287145.jpg',
        './assets/picture/pexels-faaiq-ackmerd-1025469.jpg',
        './assets/picture/pexels-jakub-novacek-924824.jpg',
        './assets/picture/pexels-johannes-plenio-1103970.jpg',
        './assets/picture/pexels-john-cahil-rom-2170473.jpg',
        './assets/picture/pexels-jot-2179483.jpg',
        './assets/picture/pexels-lisa-fotios-1083822.jpg',
        './assets/picture/pexels-markus-spiske-1089438.jpg',
        './assets/picture/pexels-maxime-francis-2246476.jpg',
        './assets/picture/pexels-pixabay-2150.jpg',
        './assets/picture/pexels-simon-berger-1323550.jpg',
        './assets/picture/pexels-vishnu-r-nair-1105666.jpg',
      ]
    },
    {
      type: 'text',
      loop: true,
      autoplay: false,
      refresh: true,
      swipe: true,
      data: [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven' , 'twelve', 'thirteen', 'fourteen', 'fifteen'
      ]
    },
    {
      type: 'cards',
      loop: true,
      refresh: true,
      swipe: true,
      data: [
        {
        id:1,
        email: "george.bluth@reqres.in" ,
        first_name:"George",
        last_name:"Bluth",
        avatar: "https://reqres.in/img/faces/1-image.jpg"
      },
      {
        id:2,
        email:"janet.weaver@reqres.in",
        first_name:"Janet",
        last_name:"Weaver",
        avatar:"https://reqres.in/img/faces/2-image.jpg"},
      {
        id:3,
        email:"emma.wong@reqres.in",
        first_name:"Emma",
        last_name:"Wong",
        avatar:"https://reqres.in/img/faces/3-image.jpg"
      },
      {
        id:4,
        email:"eve.holt@reqres.in",
        first_name:"Eve",
        last_name:"Holt",
        avatar:"https://reqres.in/img/faces/4-image.jpg"
      },
      {
        id:5,
        email:"charles.morris@reqres.in",
        first_name:"Charles",
        last_name:"Morris",
        avatar:"https://reqres.in/img/faces/5-image.jpg"
      },
      {
        id:6,
        email:"tracey.ramos@reqres.in",
        first_name:"Tracey",
        last_name:"Ramos",
        avatar:"https://reqres.in/img/faces/6-image.jpg"
      },
      {
        id: 7,
        email: "michael.lawson@reqres.in",
        first_name: "Michael",
        last_name: "Lawson",
        avatar: "https://reqres.in/img/faces/7-image.jpg"
      },
      {
        id: 8,
        email: "lindsay.ferguson@reqres.in",
        first_name: "Lindsay",
        last_name: "Ferguson",
        avatar: "https://reqres.in/img/faces/8-image.jpg"
      },
      {
        id: 9,
        email: "tobias.funke@reqres.in",
        first_name: "Tobias",
        last_name: "Funke",
        avatar: "https://reqres.in/img/faces/9-image.jpg"
      },
      {
        id: 10,
        email: "byron.fields@reqres.in",
        first_name: "Byron",
        last_name: "Fields",
        avatar: "https://reqres.in/img/faces/10-image.jpg"
      },
      {
        id: 11,
        email: "george.edwards@reqres.in",
        first_name: "George",
        last_name: "Edwards",
        avatar: "https://reqres.in/img/faces/11-image.jpg"
    },
    {
        id: 12,
        email: "rachel.howell@reqres.in",
        first_name: "Rachel",
        last_name: "Howell",
        avatar: "https://reqres.in/img/faces/12-image.jpg"
    }]
    },
]

  constructor() {
  }

  ngOnInit(): void {
  }

}
