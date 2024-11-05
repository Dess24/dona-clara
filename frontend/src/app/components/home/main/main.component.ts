import { Component, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  categoria_id: number;
  imagen: string;
  habilitado: boolean;
  destacado: boolean;
}

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
  productos: any[] = [];
  baseUrl: string = 'http://localhost:8000/images/uploads/';
  errorMessage: string = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProductos();
  }

  ngAfterViewInit() {
  }

  getProductos(): void {
    this.productoService.getProductos().subscribe(
      data => {
        // Filtrar productos que están destacados y habilitados
        this.productos = data.filter((producto: Producto) => producto.destacado && producto.habilitado);
      },
      error => {
        this.errorMessage = 'Error al cargar los productos';
        console.error('Error al cargar los productos', error);
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