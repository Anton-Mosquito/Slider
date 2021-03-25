import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { IConfig } from 'src/app/website/slider/models';

@Component({
  selector: 'app-slider-ui',
  templateUrl: './slider-ui.component.html',
  styleUrls: ['./slider-ui.component.css']
})
export class SliderUiComponent implements OnInit,AfterViewInit, OnDestroy {


  private subscription: Subscription = new Subscription()

  @Input('config') config? : any = {};

  @ViewChild('slider') slider!: ElementRef;
  @ViewChildren('sliderItem') itemList! : QueryList<ElementRef>;
  @ViewChild('sliderItems') items!: ElementRef;
  @ViewChild('wrapper') wrapper!: ElementRef;
  @ViewChild('prev') controlPrev!: ElementRef;
  @ViewChild('next') controlNext!: ElementRef;
  @ViewChildren('indicatorList') indicatorList! : QueryList<ElementRef>;


  // SELECTOR_ITEM = '.slider__item';
  // SELECTOR_ITEMS = '.slider__items';
  // SELECTOR_WRAPPER = '.slider__wrapper';
  // SELECTOR_PREV = '.slider__control[data-slide="prev"]';
  // SELECTOR_NEXT = '.slider__control[data-slide="next"]';
  // SELECTOR_INDICATOR = '.slider__indicators>li';

  SLIDER_TRANSITION_OFF = 'slider_disable-transition';
  CLASS_CONTROL = 'slider__control';
  CLASS_CONTROL_HIDE = 'slider__control_hide';
  CLASS_ITEM_ACTIVE = 'slider__item_active';
  CLASS_INDICATOR_ACTIVE = 'active';


      // configuration of the slider
      _config: IConfig = {
        loop: true,
        autoplay: false,
        interval: 5000,
        pauseOnHover: true,
        refresh: true,
        swipe: true,
        data: [],
      };
      // slider properties
      _widthItem = 0;
      _widthWrapper = 0;
      _itemsInVisibleArea = 0;
      _transform = 0; // текущее значение трансформации
      _transformStep = 0; // значение шага трансформации
      _intervalId : any= null;
      // elements of slider
      _$root = null; // root element of slider (default ".slider__item")
      _$wrapper = null; // element with class ".slider__wrapper"
      _$items = null; // element with class ".slider__items"
      _$itemList = null; // elements with class ".slider__item"
      _$controlPrev = null; // element with class .slider__control[data-slide="prev"]
      _$controlNext = null; // element with class .slider__control[data-slide="next"]
      _$indicatorList = null; // индикаторы
      // min and min order
      _minOrder = 0;
      _maxOrder = 0;
      // items with min and max order
      _$itemByMinOrder: any = null;
      _$itemByMaxOrder: any = null;
      // min and max value of translate
      _minTranslate = 0;
      _maxTranslate = 0;
      // default slider direction
      _direction: any = 'next';
      // determines whether the position of item needs to be determined
      _updateItemPositionFlag = false;
      _activeItems: any = [];
      _isTouchDevice: any = null ;
      _touchStartCoord: any = null


      constructor() {}

      ngOnInit(): void {
        this._isTouchDevice = this.hasTouchDevice();
      }

      ngAfterViewInit(): void {
        this._widthItem = this.itemList.first.nativeElement.offsetWidth;
        this._widthWrapper = this.wrapper.nativeElement.offsetWidth;
        this._itemsInVisibleArea = Math.round(this._widthWrapper / this._widthItem);
        this._transformStep = 100 / this._itemsInVisibleArea;

        this.updateConfig();

        this.itemList.toArray().forEach((element, index)=> {
          element.nativeElement.dataset.index = index;
          element.nativeElement.dataset.order = index;
          element.nativeElement.dataset.translate = 0;
          if (index < this._itemsInVisibleArea) this._activeItems.push(index);
        })

        this._updateClassForActiveItems();


        if (!this._config.loop) {
          if (this.controlPrev.nativeElement) {
            this.controlPrev.nativeElement.classList.add(this.CLASS_CONTROL_HIDE);
          }
          return;
        }

        const translate = -this.itemList.length * 100;
        this.itemList.last.nativeElement.dataset.order = -1;
        this.itemList.last.nativeElement.dataset.translate = -this.itemList.length * 100;
        this.itemList.last.nativeElement.style.transform = 'translateX('.concat(`${translate}`, '%)');

        this._updateExtremeProperties();
        this._updateIndicators();
        this._autoplay();
        this.eventListener();
      }


  hasTouchDevice() {
    return !!('ontouchstart' in window || navigator.maxTouchPoints);
  }

  hasElementInVew() {
    const rect = this.slider.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
    const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
    return vertInView && horInView;
  }


  private eventListener() {
    this.subscription.add(fromEvent(this.slider.nativeElement, 'click').subscribe( e => {
      let event = e as Event
      const target = (event.target as HTMLElement);
    this._autoplay('stop');
    if (target.classList.contains(this.CLASS_CONTROL)) {
      event.preventDefault();
      this._direction = target.dataset.slide;
      this._move();
    } else if (target.dataset.slideTo) {
      // при клике на индикаторы
      const index = +target.dataset.slideTo;
      this._moveTo(index);
    }
    this._autoplay();
    }))


    if (this._config.autoplay && this._config.pauseOnHover) {
      this.subscription.add(fromEvent(this.slider.nativeElement, 'mouseenter').subscribe(action => {
        this._autoplay('stop');
      }))

      this.subscription.add(fromEvent(this.slider.nativeElement, 'mouseleave').subscribe(action => {
        this._autoplay();
      }))
    }

    this.subscription.add(fromEvent(window, 'resize').subscribe( _ => {
      window.requestAnimationFrame(this._refresh.bind(this));
    }));


    if (this._config.loop) {
      this.subscription.add(fromEvent(this.items.nativeElement, 'transitionstart').subscribe( _ => {
        this._updateItemPositionFlag = true;
        window.requestAnimationFrame(this._updateItemPosition.bind(this));
      }));

      this.subscription.add(fromEvent(this.items.nativeElement, 'transitionend').subscribe( _ => {
        this._updateItemPositionFlag = false;
      }));
    }

    if (this._isTouchDevice && this._config.swipe) {

      this.subscription.add(fromEvent(this.slider.nativeElement, 'touchstart').subscribe(event => {
        this._touchStartCoord = (event as any).changedTouches[0].clientX;
      }));

      this.subscription.add(fromEvent(this.slider.nativeElement, 'touchend').subscribe(event => {
        const touchEndCoord = (event as any).changedTouches[0].clientX;
        const delta = touchEndCoord - this._touchStartCoord;
        if (delta > 50) {
          this._moveToPrev();
        } else if (delta < -50) {
          this._moveToNext();
        }
      }));
    }

    if (!this._isTouchDevice && this._config.swipe) {
      this.subscription.add(fromEvent(this.slider.nativeElement, 'mousedown').subscribe(event => {
        this._touchStartCoord = (event as any).clientX;
      }));

      this.subscription.add(fromEvent(this.slider.nativeElement, 'mouseup').subscribe(event => {
        const touchEndCoord = (event as any).clientX;
        const delta = touchEndCoord - this._touchStartCoord;
        if (delta > 50) {
          this._moveToPrev();
        } else if (delta < -50) {
          this._moveToNext();
        }
      }));
    }

  }

  _updateExtremeProperties() {;
    this._minOrder = +this.itemList.first.nativeElement.dataset.order;
    this._maxOrder = this._minOrder;
    this._$itemByMinOrder = this.itemList.first.nativeElement;
    this._$itemByMaxOrder = this.itemList.first.nativeElement;
    this._minTranslate = +this.itemList.first.nativeElement.dataset.translate;
    this._maxTranslate = this._minTranslate;

    this.itemList.toArray().forEach((element) => {
      const order = +element.nativeElement.dataset.order;
      if (order < this._minOrder) {
        this._minOrder = order;
        this._$itemByMinOrder = element.nativeElement;
        this._minTranslate = +element.nativeElement.dataset.translate;
      } else if (order > this._maxOrder) {
        this._maxOrder = order;
        this._$itemByMaxOrder = element.nativeElement;
        this._minTranslate = +element.nativeElement.dataset.translate;
      }
    });
  }

  _updateItemPosition(){
    if (!this._updateItemPositionFlag) return;

    const $wrapperClientRect = this.wrapper.nativeElement.getBoundingClientRect();
    const widthHalfItem = $wrapperClientRect.width / this._itemsInVisibleArea / 2;

    const count = this.itemList.length;

    if (this._direction === 'next') {
      const wrapperLeft = $wrapperClientRect.left;
      const $min = this._$itemByMinOrder;
      let translate = this._minTranslate;
      const clientRect = $min.getBoundingClientRect();
      if (clientRect.right < wrapperLeft - widthHalfItem) {
        $min.dataset.order = this._minOrder + count;
        translate += count * 100;
        $min.dataset.translate = translate;
        $min.style.transform = 'translateX('.concat(`${translate}`, '%)');
        // update values of extreme properties
        this._updateExtremeProperties();
      }
    } else {
      const wrapperRight = $wrapperClientRect.right;
      const $max = this._$itemByMaxOrder;
      let translate = this._maxTranslate;
      const clientRect = $max.getBoundingClientRect();
      if (clientRect.left > wrapperRight + widthHalfItem) {
        $max.dataset.order = this._maxOrder - count;
        translate -= count * 100;
        $max.dataset.translate = translate;
        $max.style.transform = 'translateX('.concat(`${translate}`, '%)');
        // update values of extreme properties
        this._updateExtremeProperties();
      }
    }
    // updating...
    requestAnimationFrame(this._updateItemPosition.bind(this));
  }


  _updateClassForActiveItems() {
    this.itemList.toArray().forEach((element ,i) => {
      let index  = +element.nativeElement.dataset.index;
      if (this._activeItems.indexOf(index) > -1) {
        element.nativeElement.classList.add(this.CLASS_ITEM_ACTIVE);
      } else {
        element.nativeElement.classList.remove(this.CLASS_ITEM_ACTIVE);
      }
    });
  }

  _updateIndicators() {
  if (!this.indicatorList.length) return;

  this.itemList.toArray().forEach((element ,index) => {
    if (element.nativeElement.classList.contains(this.CLASS_ITEM_ACTIVE)) {
      this.indicatorList.toArray()[index].nativeElement.classList.add(this.CLASS_INDICATOR_ACTIVE);
    } else {
      this.indicatorList.toArray()[index].nativeElement.classList.remove(this.CLASS_INDICATOR_ACTIVE);
    }
  });
  }


  _move() {
    if (!this.hasElementInVew()) return;

    const step = this._direction === 'next' ? -this._transformStep : this._transformStep;
    const transform = this._transform + step;

    if (!this._config.loop) {
      const endTransformValue = this._transformStep * (this.itemList.length - this._itemsInVisibleArea);

      if (transform < -endTransformValue || transform > 0) return;

      this.controlPrev.nativeElement.classList.remove(this.CLASS_CONTROL_HIDE);
      this.controlNext.nativeElement.classList.remove(this.CLASS_CONTROL_HIDE);

      if (transform === -endTransformValue) {
        this.controlNext.nativeElement.classList.add(this.CLASS_CONTROL_HIDE);
      } else if (transform === 0) {
        this.controlPrev.nativeElement.classList.add(this.CLASS_CONTROL_HIDE);
      }
    }

    const activeIndex: any = [];

    if (this._direction === 'next') {
      this._activeItems.forEach((element: number, i: number) => {
        let index = element;
        let newIndex = ++index;
        if (newIndex > this.itemList.length - 1) newIndex -= this.itemList.length;
        activeIndex.push(newIndex);
      });
    } else {
      this._activeItems.forEach((element: number) => {
        let index = element;
        let newIndex = --index;
        if (newIndex < 0) newIndex += this.itemList.length;
        activeIndex.push(newIndex);
      });
    }

    this._activeItems = activeIndex;

    this._updateClassForActiveItems();
    this._updateIndicators();

    this._transform = transform;
    this.items.nativeElement.style.transform = 'translateX('.concat(`${transform}`, '%)');
  }

  _moveToNext() {
    this._direction = 'next';
    this._move();
  }

  _moveToPrev() {
    this._direction = 'prev';
    this._move();
  };

  _moveTo (index: number) {
    let nearestIndex: any = null;
    let diff: any = null;

    this.indicatorList.forEach(element => {
      if (element.nativeElement.classList.contains(this.CLASS_INDICATOR_ACTIVE)) {
        const slideTo = +element.nativeElement.dataset.slideTo;
        if (diff === null) {
          nearestIndex = slideTo;
          diff = Math.abs(index - nearestIndex);
        } else {
          if (Math.abs(index - slideTo) < diff) {
            nearestIndex = slideTo;
            diff = Math.abs(index - nearestIndex);
          }
        }
      }
    });

    diff = index - nearestIndex;
    if (diff === 0) {
      return;
    }

    this._direction = diff > 0 ? 'next' : 'prev';
    for (let i = 1; i <= Math.abs(diff); i++) {
      this._move();
    }
  };

  _autoplay(action?: string) {
    if (!this._config.autoplay) return;

    // console.log(this._config.autoplay);


    if (action === 'stop') {
      clearInterval(this._intervalId);
      this._intervalId = null;
      return;
    }

    if (this._intervalId === null){
      this._intervalId = setInterval( () => {
          this._direction = 'next';
          this._move();
        }, this._config.interval);
    }
  };

  _refresh() {
    // create some constants
    const widthItem = this.itemList.first.nativeElement.offsetWidth;
    const widthWrapper = this.wrapper.nativeElement.offsetWidth;
    const itemsInVisibleArea = Math.round(widthWrapper / widthItem);

    if (itemsInVisibleArea === this._itemsInVisibleArea) return;

    this._autoplay('stop');

    this.items.nativeElement.classList.add(this.SLIDER_TRANSITION_OFF);
    this.items.nativeElement.style.transform = 'translateX(0)';

    // setting properties after reset
    this._widthItem = widthItem;
    this._widthWrapper = widthWrapper;
    this._itemsInVisibleArea = itemsInVisibleArea;
    this._transform = 0;
    this._transformStep = 100 / itemsInVisibleArea;
    this._updateItemPositionFlag = false;
    this._activeItems = [];

    // setting order and translate items after reset
    this.itemList.forEach((element, index) => {
      const position = index;
      element.nativeElement.dataset.index = position;
      element.nativeElement.dataset.order = position;
      element.nativeElement.dataset.translate = 0;
      element.nativeElement.style.transform = 'translateX(0)';
      if (position < itemsInVisibleArea) {
        this._activeItems.push(position);
      }
    })

    this._updateClassForActiveItems();

    window.requestAnimationFrame(()=> this.items.nativeElement.classList.remove(this.SLIDER_TRANSITION_OFF));

    // hide prev arrow for non-infinite slider
    if (!this._config.loop) {
      if (this.controlPrev.nativeElement) {
        this.controlPrev.nativeElement.classList.add(this.CLASS_CONTROL_HIDE);
      }
      return;
    }

    // translate last item before first
    const translate = -this.itemList.length * 100;
    this.itemList.last.nativeElement.dataset.order = -1;
    this.itemList.last.nativeElement.dataset.translate = -this.itemList.length * 100;
    this.itemList.last.nativeElement.style.transform = 'translateX('.concat(`${translate}`, '%)');
    // update values of extreme properties
    this._updateExtremeProperties();
    this._updateIndicators();
    // calling _autoplay
    this._autoplay();
  }

  private updateConfig(): void {
    if (!this.config) return

    for (const [key, value] of Object.entries(this.config)) {
        this._config[key] = this.config[key];
      }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

