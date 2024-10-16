import { Component, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HttpClientModule, CommonModule], // Importar HttpClientModule y CommonModule
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  providers: [ProductoService] // Registrar ProductoService como proveedor
})
export class MainComponent implements OnInit {
  @ViewChild('carousel', { static: false }) carousel: ElementRef | undefined;
  @ViewChildren('card') cards: QueryList<ElementRef> | undefined;
  productosRecientes: any[] = [];
  baseUrl: string = 'http://localhost:8000/images/uploads/';

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProductosRecientes();
  }

  ngAfterViewInit() {
  }

  getProductosRecientes(): void {
    this.productoService.getProductosRecientes().subscribe(
      data => {
        this.productosRecientes = data;
      },
      error => {
        console.error('Error al obtener los productos recientes', error);
      }
    );
  }

  onArrowLeftClick(event: MouseEvent) {
    // Encuentra el contenedor del carousel específico
    const carouselContainer = (event.target as HTMLElement).closest('.section1');
    if (!carouselContainer) return;
  
    // Selecciona solo el carousel dentro del contenedor específico
    const carousel = carouselContainer.querySelector('.carousel');
    const cardWidth = carouselContainer.querySelector('.card')?.clientWidth || 0;
    if (carousel) {
      carousel.scrollLeft -= cardWidth;
    }
  }
  
  onArrowRightClick(event: MouseEvent) {
    // Encuentra el contenedor del carousel específico
    const carouselContainer = (event.target as HTMLElement).closest('.section1');
    if (!carouselContainer) return;
  
    // Selecciona solo el carousel dentro del contenedor específico
    const carousel = carouselContainer.querySelector('.carousel');
    const cardWidth = carouselContainer.querySelector('.card')?.clientWidth || 0;
    if (carousel) {
      carousel.scrollLeft += cardWidth;
    }
  }
}