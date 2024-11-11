import { Component, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../../services/carrito.service'; 

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
  providers: [ProductoService, CarritoService] // Registrar ProductoService como proveedor
})
export class MainComponent implements OnInit {
  @ViewChild('carousel', { static: false }) carousel: ElementRef | undefined;
  @ViewChildren('card') cards: QueryList<ElementRef> | undefined;
  productos: any[] = [];
  baseUrl: string = 'http://localhost:8000/images/uploads/';
  errorMessage: string = '';
  selectedProduct: Producto | null = null;
  categorias: any[] = [];
  categoriasSeleccionadas: string[] = [];
  isLoggedIn: boolean = false;


  constructor(private productoService: ProductoService, private router: Router, private carritoService: CarritoService,) {}

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
    this.getProductos();
    this.getCategorias();
  }


  // Añadir producto al carrito
anadirProducto(productoId: number, cantidad: number): void {
  if (!this.isLoggedIn) {
    return;
  }

  this.carritoService.añadirProducto(productoId, cantidad).subscribe(
    data => {
      console.log('Producto añadido al carrito', data);
    },
    error => {
      this.errorMessage = 'Error al añadir el producto al carrito';
      console.error('Error al añadir el producto al carrito', error);
    }
  );
}

  getCategorias(): void {
    this.productoService.getCategorias().subscribe(
      data => {
        this.categorias = data;
      },
      error => {
        this.errorMessage = 'Error al cargar las categorías';
        console.error('Error al cargar las categorías', error);
      }
    );
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriasSeleccionadas = [categoria];
    localStorage.setItem('categoriasSeleccionadas', JSON.stringify(this.categoriasSeleccionadas));
    this.router.navigate(['/catalogo']);
  }

  // Buscar productos por las categorías seleccionadas
  buscarPorCategoriasSeleccionadas(): void {
    if (this.categoriasSeleccionadas.length > 0) {
      this.productoService.buscarPorCategorias(this.categoriasSeleccionadas).subscribe(
        data => {
          this.productos = data;
        },
        error => {
          this.errorMessage = 'Error al buscar productos por categorías';
          console.error('Error al buscar productos por categorías', error);
        }
      );
    } else {
      window.location.reload(); // Recargar la página si no hay categorías seleccionadas
    }
  }

  ngAfterViewInit() {
  }

  showAlert() {
    const modal = document.getElementById('alert-container') as HTMLElement;
    modal.style.display = 'flex';
    modal.classList.add('fade-in');
  
    setTimeout(() => {
      modal.classList.remove('fade-in');
      modal.classList.add('fade-out');
  
      setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fade-out');
      }, 500); // Duration of fade-out animation
    }, 2000);
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

  modalClose2() {
    const modal = document.getElementById('alert-container') as HTMLElement;
    modal.style.display = 'none';
  }

  openProductModal(product: any): void {
    this.selectedProduct = product;
    const modal = document.getElementById('container-modal3') as HTMLElement;
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  modalCloseProduct(): void {
    const modal = document.getElementById('container-modal3') as HTMLElement;
    if (modal) {
      modal.style.display = 'none';
    }
  }
}