import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit {
  @ViewChildren('carouselItem') carouselItems!: QueryList<ElementRef>;
  currentIndex: number = 0;

  ngAfterViewInit() {
    this.showSlide(this.currentIndex);
  }

  showSlide(index: number, direction: 'left' | 'right' = 'left') {
    this.carouselItems.forEach((item, i) => {
      item.nativeElement.classList.add('hidden');
      item.nativeElement.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
      if (i === index) {
        item.nativeElement.classList.remove('hidden');
        item.nativeElement.classList.add(direction === 'left' ? 'slide-in-left' : 'slide-in-right');
      }
    });
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.carouselItems.length;
    this.carouselItems.toArray()[this.currentIndex].nativeElement.classList.add('slide-out-right');
    this.currentIndex = nextIndex;
    this.showSlide(this.currentIndex, 'right');
  }

  prevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
    this.carouselItems.toArray()[this.currentIndex].nativeElement.classList.add('slide-out-left');
    this.currentIndex = prevIndex;
    this.showSlide(this.currentIndex, 'left');
  }
}