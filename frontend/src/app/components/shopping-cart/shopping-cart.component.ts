import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { CarritoService } from '../../services/carrito.service';
import { UserService } from '../../services/user.service';
import { ProductoService } from '../../services/producto.service';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  monto_total: number;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
  providers: [ProductoService, UserService, CarritoService] // Añadir CarritoService a los proveedores
})
export class ShoppingCartComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  searchQuery: string = '';
  baseUrl: string = 'http://localhost:8000/images/uploads/';
  carrito: { productosCarrito: ItemCarrito[] } = { productosCarrito: [] };
  errorMessage: string | null = null;

  constructor(private carritoService: CarritoService, private productoService: ProductoService) { }

  ngOnInit(): void {
    this.verCarrito();
    this.getProductos();
    this.getCategorias();
  }

  verCarrito(): void {
    this.carritoService.verCarrito().subscribe(
      data => {
        this.carrito = data;
      },
      error => {
        this.errorMessage = 'Error al cargar el carrito';
        console.error('Error al cargar el carrito', error);
      }
    );
  }

  anadirProducto(productoId: number, cantidad: number): void {
    this.carritoService.añadirProducto(productoId, cantidad).subscribe(
      data => {
        this.verCarrito(); // Actualizar el carrito después de añadir un producto
      },
      error => {
        this.errorMessage = 'Error al añadir el producto al carrito';
        console.error('Error al añadir el producto al carrito', error);
      }
    );
  }

  restarProducto(productoId: number, cantidad: number): void {
    this.carritoService.restarProducto(productoId, cantidad).subscribe(
      data => {
        this.verCarrito(); // Actualizar el carrito después de restar un producto
      },
      error => {
        this.errorMessage = 'Error al restar el producto del carrito';
        console.error('Error al restar el producto del carrito', error);
      }
    );
  }

  checkout(): void {
    this.carritoService.checkout().subscribe(
      data => {
        this.verCarrito(); // Actualizar el carrito después del checkout
        window.location.reload(); // Recargar la página
      },
      error => {
        this.errorMessage = 'Error al realizar el checkout';
        console.error('Error al realizar el checkout', error);
      }
    );
  }

  getTotal(): number {
    return this.carrito.productosCarrito.reduce((total, item: ItemCarrito) => total + item.cantidad * item.producto.precio, 0);
  }

  // Listar todos los productos
  getProductos(): void {
    this.productoService.getProductos().subscribe(
      data => {
        this.productos = data;
      },
      error => {
        this.errorMessage = 'Error al cargar los productos';
        console.error('Error al cargar los productos', error);
      }
    );
  }

  // Listar todas las categorías
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

  // Buscar productos por categoría
  buscarPorCategoria(categoria: string): void {
    this.productoService.buscarPorCategoria(categoria).subscribe(
      data => {
        this.productos = data;
      },
      error => {
        this.errorMessage = 'Error al buscar productos por categoría';
        console.error('Error al buscar productos por categoría', error);
      }
    );
  }

  // Buscar productos por nombre
  buscarPorNombre(): void {
    if (this.searchQuery.trim() === '') {
      this.getProductos();
      return;
    }

    this.productoService.buscarPorNombre(this.searchQuery).subscribe(
      data => {
        this.productos = data;
      },
      error => {
        this.errorMessage = 'Error al buscar productos por nombre';
        console.error('Error al buscar productos por nombre', error);
      }
    );
  }

  modal(){
    const modal = document.getElementById('container-modal') as HTMLElement;
    modal.style.display = 'flex';
  }
  
  modalClose() {
    const modal = document.getElementById('container-modal') as HTMLElement;
    modal.style.display = 'none';
  
    // Restaurar colores originales de las opciones seleccionadas
    const selectedOptions = modal.querySelectorAll('.selected');
    selectedOptions.forEach(option => {
      const element = option as HTMLElement;
      element.style.backgroundColor = ''; // Color de fondo original
      element.style.color = ''; // Color de texto original
      element.classList.remove('selected');
  
      // Restaurar colores originales de los elementos hijos
      const children = element.querySelectorAll('*');
      children.forEach(child => {
        (child as HTMLElement).style.color = '';
      });
    });
  }
  
  
  
  cambiarColorOpcion(event: Event): void {
    const target = event.target as HTMLElement;
    const isSelected = target.classList.contains('selected');
  
    if (isSelected) {
      // Restaurar colores originales
      target.style.backgroundColor = ''; // Color de fondo original
      target.style.color = ''; // Color de texto original
      target.classList.remove('selected');
    } else {
      // Cambiar a colores seleccionados
      target.style.backgroundColor = 'rgb(22 163 74)'; // Cambia el color de fondo
      target.style.color = 'white'; // Cambia el color del texto
      target.classList.add('selected');
    }
  
    // Cambiar el color de todos los elementos hijos y hacerlos no clickeables
    const children = target.querySelectorAll('*');
    children.forEach(child => {
      const childElement = child as HTMLElement;
      childElement.style.color = isSelected ? '' : 'white';
      childElement.style.pointerEvents = isSelected ? '' : 'none';
    });
  }


}