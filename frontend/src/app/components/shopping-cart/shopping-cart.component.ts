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
  private downloadUrl: string | null = null;
  private downloadAnchor: HTMLAnchorElement | null = null;
  filtroAlfabeticoActivo: string | null = null;
  filtroPrecioActivo: string | null = null;


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

  ordenarAlfabeticamente(orden: string, restablecer: boolean = true): void {
    const filtro = orden === 'asc' ? 'alfabetico-asc' : 'alfabetico-desc';
    
    if (this.filtroAlfabeticoActivo === filtro) {
      if (restablecer) {
        this.verCarrito();
      }
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => !c.startsWith('alfabetico'));
      this.filtroAlfabeticoActivo = null;
      return;
    }
    
    this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => !c.startsWith('alfabetico'));
    
    if (orden === 'asc') {
      this.carrito.productosCarrito.sort((a, b) => a.producto.nombre.localeCompare(b.producto.nombre));
    } else {
      this.carrito.productosCarrito.sort((a, b) => b.producto.nombre.localeCompare(a.producto.nombre));
    }
    
    this.sortState = 1;
    this.categoriasSeleccionadas.push(filtro);
    this.filtroAlfabeticoActivo = filtro;
    
    if (restablecer) {
      this.aplicarFiltros();
    }
  }

  ordenarPorPrecio(orden: string, restablecer: boolean = true): void {
    const filtro = orden === 'asc' ? 'precio-asc' : 'precio-desc';
    
    if (this.filtroPrecioActivo === filtro) {
      if (restablecer) {
        this.verCarrito();
      }
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => !c.startsWith('precio'));
      this.filtroPrecioActivo = null;
      return;
    }
    
    this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => !c.startsWith('precio'));
    
    if (orden === 'asc') {
      this.carrito.productosCarrito.sort((a, b) => a.producto.precio - b.producto.precio);
    } else {
      this.carrito.productosCarrito.sort((a, b) => b.producto.precio - a.producto.precio);
    }
    
    this.sortState = 1;
    this.categoriasSeleccionadas.push(filtro);
    this.filtroPrecioActivo = filtro;
    
    if (restablecer) {
      this.aplicarFiltros();
    }
  }

  aplicarFiltros(): void {
    // Implementar la lógica para aplicar los filtros
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
      (response: Blob) => {
        this.downloadUrl = window.URL.createObjectURL(response);
        this.downloadAnchor = document.createElement('a');
        this.downloadAnchor.href = this.downloadUrl;
        this.downloadAnchor.download = 'factura_compra.pdf';
        document.body.appendChild(this.downloadAnchor);

        this.openModal();
      },
      error => {
        this.errorMessage = 'Error al realizar el checkout';
        console.error('Error al realizar el checkout', error);
      }
    );
  }

  openModal(): void {
    const modal = document.getElementById('confirm-download-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal(): void {
    const modal = document.getElementById('confirm-download-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    if (this.downloadUrl) {
      window.URL.revokeObjectURL(this.downloadUrl);
      this.downloadUrl = null;
    }
    if (this.downloadAnchor) {
      document.body.removeChild(this.downloadAnchor);
      this.downloadAnchor = null;
    }
  }

  confirmDownload(): void {
    if (this.downloadAnchor) {
      this.downloadAnchor.click();
    }
    this.closeModal();
    this.verCarrito(); // Actualizar el carrito después del checkout
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
  

  eliminarProducto(productoId: number): void {
    this.carritoService.eliminarProducto(productoId).subscribe(response => {
      this.verCarrito();
      console.log(response);
      const numeroDeProductos = this.carrito.productosCarrito.length;
      console.log(`Número de productos en el carrito: ${numeroDeProductos}`);
      if (numeroDeProductos === 1) {
        window.location.reload();
      }
    }, error => {
      console.error(error);
    });
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
  
  actualizarProducto(productoId: number, nuevaCantidad: number): void {
    this.carritoService.actualizarProducto(productoId, nuevaCantidad).subscribe(
      data => {
        this.verCarrito(); // Actualizar el carrito después de actualizar un producto
      },
      error => {
        this.errorMessage = 'Error al actualizar el producto en el carrito';
        console.error('Error al actualizar el producto en el carrito', error);
      }
    );
  }

  limitarCantidad(item: any): void {
    if (item.cantidad < 1) {
      item.cantidad = 1;
    } else if (item.cantidad > item.producto.cantidad) {
      item.cantidad = item.producto.cantidad;
    }
  }

  getPrecioTotal(item: any): number {
    return item.producto.precio * item.cantidad;
  }
  
}
