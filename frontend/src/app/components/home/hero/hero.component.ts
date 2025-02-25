import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

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
  fotos: any[] = [];

  constructor(private router: Router, private userService: UserService) {}
  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
    this.userService.getFotosSlider().subscribe(data => {
      console.log(data); // Verifica los datos en la consola
      this.fotos = data;
    });
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