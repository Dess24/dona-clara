import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { CarritoService } from '../../services/carrito.service';
import { UserService } from '../../services/user.service';

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
  imports: [CommonModule, NavbarComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
  providers: [CarritoService, UserService]
})
export class ShoppingCartComponent implements OnInit {
  carrito: { productosCarrito: ItemCarrito[] } = { productosCarrito: [] };
  errorMessage: string | null = null;

  constructor(private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.verCarrito();
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

  isRestarDisabled(cantidad: number): boolean {
    return cantidad <= 1;
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
}