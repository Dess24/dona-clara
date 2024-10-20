import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FooterComponent } from '../home/footer/footer.component';
import { ProductoService } from '../../services/producto.service';
import { UserService } from '../../services/user.service';
import { CarritoService } from '../../services/carrito.service'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet, RouterModule} from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, HttpClientModule, CommonModule, FormsModule, RouterModule, RouterOutlet],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
  providers: [ProductoService, UserService, CarritoService] // Añadir CarritoService a los proveedores
})
export class CatalogoComponent implements OnInit {
  isLoggedIn: boolean = false;
  isLoggedInAdmin: boolean = false;
  productos: any[] = [];
  categorias: any[] = [];
  categoriasSeleccionadas: string[] = [];
  errorMessage: string | null = null;
  searchQuery: string = '';
  baseUrl: string = 'http://localhost:8000/images/uploads/';
  sortState: number = 0; // 0: no ordenado, 1: ascendente, 2: descendente
  showLoginMessage: boolean = false;
  
  

  constructor(private productoService: ProductoService, private carritoService: CarritoService, private router: Router, private userService: UserService) {} // Inyectar CarritoService

  ngOnInit(): void {
    this.getProductos();
    this.getCategorias();
    this.isLoggedIn = !!localStorage.getItem('auth_token');
    if (this.isLoggedIn) {
      this.userService.getUserInfo().subscribe(response => {
        this.isLoggedInAdmin = !!response.user.admin;
      });
    }
    if (this.isLoggedIn) {
      this.userService.getUserInfo().subscribe(response => {
        this.isLoggedInAdmin = !!response.user.admin;
      });
    }
  }

  onLogout(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedIn = false;
    this.isLoggedInAdmin = false;
    this.isLoggedInAdmin = false;
    this.router.navigate(['/login']);
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

// Verificar si una categoría está seleccionada
isCategoriaSeleccionada(categoria: string): boolean {
  return this.categoriasSeleccionadas.includes(categoria);
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

// Añadir producto al carrito
anadirProducto(productoId: number, cantidad: number): void {
  if (!this.isLoggedIn) {
    alert('Se necesita registrarse');
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

  modal() {
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
}