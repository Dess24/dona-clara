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
  descripcion: string;
  precio: number;
  cantidad: number;
  categoria_id: number;
  imagen: string;
  habilitado: boolean;
  destacado: boolean;
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
  categoriasSeleccionadas: string[] = [];
  searchQuery: string = '';
  baseUrl: string = 'http://localhost:8000/images/uploads/';
  carrito: { productosCarrito: ItemCarrito[] } = { productosCarrito: [] };
  errorMessage: string | null = null;
  sortState: number = 0; // 0: no ordenado, 1: ascendente, 2: descendente
  selectedProduct: Producto | null = null;


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

  actualizarProducto(productoId: number, nuevaCantidad: number): void {
    // Obtener la cantidad actual del producto en el carrito
    const item = this.carrito.productosCarrito.find(item => item.producto.id === productoId);
    const cantidadActual = item ? item.cantidad : 0;

    if (nuevaCantidad > cantidadActual) {
      const diferencia = nuevaCantidad - cantidadActual;
      this.carritoService.añadirProducto(productoId, diferencia).subscribe(
        data => {
          this.verCarrito(); // Actualizar el carrito después de añadir un producto
        },
        error => {
          this.errorMessage = 'Error al añadir el producto al carrito';
          console.error('Error al añadir el producto al carrito', error);
        }
      );
    } else if (nuevaCantidad < cantidadActual) {
      const diferencia = cantidadActual - nuevaCantidad;
      this.carritoService.restarProducto(productoId, diferencia).subscribe(
        data => {
          this.verCarrito(); // Actualizar el carrito después de restar un producto
        },
        error => {
          this.errorMessage = 'Error al restar el producto del carrito';
          console.error('Error al restar el producto del carrito', error);
        }
      );
    }
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

 // Manejar la selección de categorías
 sumarCategorias(categoria: string): void {
  const index = this.categoriasSeleccionadas.indexOf(categoria);
  if (index === -1) {
    this.categoriasSeleccionadas.push(categoria);
  } else {
    this.categoriasSeleccionadas.splice(index, 1);
  }
  console.log('Categorías seleccionadas:', this.categoriasSeleccionadas);
}

// Eliminar una categoría seleccionada y recargar productos
eliminarCategoria(categoria: string): void {
  const index = this.categoriasSeleccionadas.indexOf(categoria);
  if (index !== -1) {
    this.categoriasSeleccionadas.splice(index, 1);
    if (this.categoriasSeleccionadas.length === 0) {
      window.location.reload(); // Recargar la página si no hay categorías seleccionadas
    } else {
      this.buscarPorCategoriasSeleccionadas(); // Recargar productos después de eliminar la categoría
    }
  }
  console.log('Categoría eliminada:', categoria);
  console.log('Categorías seleccionadas:', this.categoriasSeleccionadas);
}

// Buscar productos por las categorías seleccionadas
buscarPorCategoriasSeleccionadas(): void {
  if (this.categoriasSeleccionadas.length > 0) {
    this.productoService.buscarPorCategorias(this.categoriasSeleccionadas).subscribe(
      data => {
        this.productos = data;
        this.modalClose(); // Cerrar el modal después de buscar
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

// Verificar si una categoría está seleccionada
isCategoriaSeleccionada(categoria: string): boolean {
  return this.categoriasSeleccionadas.includes(categoria);
}

  // Buscar productos por nombre
  buscarPorNombre(): void {
    if (this.searchQuery.trim() === '') {
      this.getProductos();
      return;
    }

    this.productoService.buscarPorNombre(this.searchQuery).subscribe(
      data => {
        this.productos = data.productos; // Asegúrate de acceder a la propiedad correcta
        if (this.productos.length === 0) {
          alert('No se encontraron productos');
        }
      },
      error => {
        this.errorMessage = 'Error al buscar productos por nombre';
        console.error('Error al buscar productos por nombre', error);
        if (error.status === 404) {
          alert('No se encontraron productos');
        }
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


  ordenarAlfabeticamente(): void {
    if (this.sortState === 0) {
        this.productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.sortState = 1;
    } else if (this.sortState === 1) {
        this.productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
        this.sortState = 2;
    } else {
        this.getProductos();
        this.sortState = 0;
    }
  }
  
  ordenarPorPrecio(): void {
    if (this.sortState === 0) {
        this.productos.sort((a, b) => a.precio - b.precio);
        this.sortState = 1;
    } else if (this.sortState === 1) {
        this.productos.sort((a, b) => b.precio - a.precio);
        this.sortState = 2;
    } else {
        this.getProductos();
        this.sortState = 0;
    }
  }
  

  eliminarProducto(productoId: number): void {
    this.carritoService.eliminarProducto(productoId).subscribe(response => {
      this.verCarrito();
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  limitarCantidad(item: any): void {
    if (item.cantidad > item.producto.stock) {
      item.cantidad = item.producto.stock;
    }
  }

  
  openProductModal(product: Producto): void {
    this.selectedProduct = product;
    const modal = document.getElementById('container-modal3') as HTMLElement;
    modal.style.display = 'flex';
  }
  
  modalCloseProduct(): void {
    const modal = document.getElementById('container-modal3') as HTMLElement;
    modal.style.display = 'none';
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

  
}
