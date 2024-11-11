import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit, OnInit {
  @ViewChildren('carouselItem') carouselItems!: QueryList<ElementRef>;
  currentIndex: number = 0;
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}
  ngAfterViewInit() {
    this.showSlide(this.currentIndex);
  }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
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

  moveTo(section: string) {
    // Navega a la ruta "/inicio"
    this.router.navigate(['/inicio']).then(() => {
      // Después de navegar, desplázate a la sección
      const element = document.getElementById(section);
      if (element) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  }
}