import { Component, ViewChild, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Navbar2Component } from '../home/navbar2/navbar2.component';
import { FooterComponent } from '../home/footer/footer.component';
import { ProductoService } from '../../services/producto.service';
import { UserService } from '../../services/user.service';
import { CarritoService } from '../../services/carrito.service'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet, RouterModule} from '@angular/router';

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
  selector: 'app-catalogo',
  standalone: true,
  imports: [Navbar2Component, FooterComponent, HttpClientModule, CommonModule, FormsModule, RouterModule, RouterOutlet],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
  providers: [ProductoService, UserService, CarritoService] // Añadir CarritoService a los proveedores
})
export class CatalogoComponent implements OnInit, OnDestroy {
  @ViewChild('alertContainer') alertContainer!: ElementRef;
  isLoggedIn: boolean = false;
  isLoggedInAdmin: boolean = false;
  productos: any[] = [];
  categorias: any[] = [];
  categoriasSeleccionadas: string[] = [];
  categoriasSeleccionadas2: string[] = [];
  errorMessage: string | null = null;
  searchQuery: string = '';
  baseUrl: string = 'https://donaclara.shop/api/public/images/uploads/';
  sortState: number = 0; // 0: no ordenado, 1: ascendente, 2: descendente
  showLoginMessage: boolean = false;
  filtroAlfabeticoActivo: string | null = null;
  filtroPrecioActivo: string | null = null;
  fileUploaded: boolean = false;
  selectedProduct: Producto | null = null;
  displayedProductos: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;
  
  

  constructor(private productoService: ProductoService, private carritoService: CarritoService, private router: Router, private userService: UserService) {} // Inyectar CarritoService

  ngOnInit(): void {
    window.scrollTo(0, 0); // Desplazar hacia arriba al cargar la página
    const categoriasSeleccionadas = localStorage.getItem('categoriasSeleccionadas');
    if (categoriasSeleccionadas) {
      this.categoriasSeleccionadas = JSON.parse(categoriasSeleccionadas);
      this.buscarPorCategoriasSeleccionadas();
    } else {
      this.getProductos();
    }
    this.getCategorias();
    this.isLoggedIn = !!localStorage.getItem('auth_token');
    if (this.isLoggedIn) {
      this.userService.getUserInfo().subscribe(response => {
        this.isLoggedInAdmin = !!response.user.admin;
      });
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('categoriasSeleccionadas');
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
        this.productos = data.filter((producto: Producto) => producto.habilitado); // Filtrar productos habilitados
        this.totalPages = Math.ceil(this.productos.length / this.itemsPerPage);
        this.updateDisplayedProductos();
      },
      error => {
        this.errorMessage = 'Error al cargar los productos';
        console.error('Error al cargar los productos', error);
      }
    );
  }

  updateDisplayedProductos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedProductos = this.productos.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProductos();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedProductos();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProductos();
    }
  }

  getPages(): number[] {
    if (this.totalPages <= 6) {
      return Array.from({ length: this.totalPages - 1 }, (_, i) => i + 1);
    } else if (this.currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    } else if (this.currentPage >= this.totalPages - 3) {
      return [this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1];
    } else {
      return [this.currentPage - 2, this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2];
    }
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

// Manejar la selección de categorías (máximo 4)
sumarCategorias(categoria: string): void {
  const index = this.categoriasSeleccionadas.indexOf(categoria);
  if (index === -1) {
    if (this.categoriasSeleccionadas.length < 4) {
      this.categoriasSeleccionadas.push(categoria);
    } else {
      console.log('No se pueden seleccionar más de 4 categorías.');
    }
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
  localStorage.removeItem('categoriasSeleccionadas');
  const index = this.categoriasSeleccionadas.indexOf(categoria);
  if (index !== -1) {
    this.categoriasSeleccionadas.splice(index, 1);
    this.currentPage = 1; // Cambiar a la página 1 de la paginación
    if (this.categoriasSeleccionadas.length === 0) {
      this.getProductos();
    } else {
      this.buscarPorCategoriasSeleccionadas(); // Recargar productos después de eliminar la categoría
    }
  }
  console.log('Categoría eliminada:', categoria);
  console.log('Categorías seleccionadas:', this.categoriasSeleccionadas);
}

// Buscar productos por las categorías seleccionadas
  buscarPorCategoriasSeleccionadas(): void {
    localStorage.removeItem('categoriasSeleccionadas');
    this.categoriasSeleccionadas2 = this.categoriasSeleccionadas;
    if (this.categoriasSeleccionadas2.length > 0) {
      this.productoService.buscarPorCategorias(this.categoriasSeleccionadas2).subscribe(
        data => {
          this.productos = data;
          this.updateDisplayedProductos(); // Actualizar los productos mostrados
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
        this.productos = data.productos; // Asegúrate de acceder a la propiedad correcta
        if (this.productos.length === 0) {
          alert('No se encontraron productos');
        }
        this.updateDisplayedProductos(); // Actualizar los productos mostrados
      },
      error => {
        this.errorMessage = 'Error al buscar productos por nombre';
        console.error('Error al buscar productos por nombre', error);
        if (error.status === 404) {
          this.alertBuscar();
        }
      }
    );
  }

alertBuscar(){
  const modal = document.getElementById('alert-buscar') as HTMLElement;
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

alertCloseBuscar() {
  const modal = document.getElementById('alert-buscar') as HTMLElement;
  modal.style.display = 'none';
}

// Añadir producto al carrito
anadirProducto(productoId: number, cantidad: number): void {
  const producto = this.productos.find(p => p.id === productoId);
  
  if (!this.isLoggedIn) {
    this.showAlert3();
    return;
  }

  if (producto && producto.cantidad >= cantidad) {
    this.carritoService.añadirProducto(productoId, cantidad).subscribe(
      data => {
        console.log('Producto añadido al carrito', data);
        this.showAlert();
      },
      error => {
        this.errorMessage = 'Error al añadir el producto al carrito';
        console.error('Error al añadir el producto al carrito', error);
      }
    );
    this.modalCloseProduct();
  } else {
    this.showAlert2();
  }
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
  
  aplicarFiltros(): void {
    if (this.filtroAlfabeticoActivo) {
      const orden = this.filtroAlfabeticoActivo.endsWith('asc') ? 'asc' : 'desc';
      this.ordenarAlfabeticamente(orden, false); // No restablecer productos
    }
    if (this.filtroPrecioActivo) {
      const orden = this.filtroPrecioActivo.endsWith('asc') ? 'asc' : 'desc';
      this.ordenarPorPrecio(orden, false); // No restablecer productos
    }
    this.updateDisplayedProductos(); // Asegúrate de actualizar los productos mostrados después de aplicar los filtros
  }
  
  ordenarAlfabeticamente(orden: string, restablecer: boolean = true): void {
    const filtro = orden === 'asc' ? 'alfabetico-asc' : 'alfabetico-desc';

    if (this.filtroAlfabeticoActivo === filtro) {
      if (restablecer) {
        this.getProductos();
      }
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => !c.startsWith('alfabetico'));
      this.filtroAlfabeticoActivo = null;
      return;
    }

    this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => !c.startsWith('alfabetico'));

    if (orden === 'asc') {
      this.productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else {
      this.productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    this.sortState = 1;
    this.categoriasSeleccionadas.push(filtro);
    this.filtroAlfabeticoActivo = filtro;

    if (restablecer) {
      this.aplicarFiltros();
    }
    this.updateDisplayedProductos(); // Asegúrate de actualizar los productos mostrados después de ordenar
  }
  
  ordenarPorPrecio(orden: string, restablecer: boolean = true): void {
    const filtro = orden === 'asc' ? 'precio-asc' : 'precio-desc';

    if (this.filtroPrecioActivo === filtro) {
      if (restablecer) {
        this.getProductos();
      }
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => !c.startsWith('precio'));
      this.filtroPrecioActivo = null;
      return;
    }

    this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => !c.startsWith('precio'));

    if (orden === 'asc') {
      this.productos.sort((a, b) => a.precio - b.precio);
    } else {
      this.productos.sort((a, b) => b.precio - a.precio);
    }

    this.sortState = 1;
    this.categoriasSeleccionadas.push(filtro);
    this.filtroPrecioActivo = filtro;

    if (restablecer) {
      this.aplicarFiltros();
    }
    this.updateDisplayedProductos(); // Asegúrate de actualizar los productos mostrados después de ordenar
  }

  showAlert(): void {
    const modal = document.getElementById('alert-container') as HTMLElement;
    if (modal) {
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
    } else {
      console.error('Elemento con ID alert-container no encontrado');
    }
  }
  
  showAlert2(): void {
    const modal = document.getElementById('alert-container2') as HTMLElement;
    if (modal) {
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
    } else {
      console.error('Elemento con ID alert-container2 no encontrado');
    }
  }

  showAlert3(): void {
    const modal = document.getElementById('alert-container3') as HTMLElement;
    if (modal) {
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
    } else {
      console.error('Elemento con ID alert-container2 no encontrado');
    }
  }

modalClose2() {
  const modal = document.getElementById('alert-container') as HTMLElement;
  modal.style.display = 'none';
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


