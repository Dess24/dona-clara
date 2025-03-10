import { Component, OnInit } from '@angular/core';
import { Navbar3Component } from '../home/navbar3/navbar3.component';
import { FooterComponent } from '../home/footer/footer.component';
import { ProductoService } from '../../services/producto.service';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Producto {
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
  selector: 'app-admin-product-panel',
  standalone: true,
  imports: [ Navbar3Component, FooterComponent, HttpClientModule, CommonModule, FormsModule ],
  templateUrl: './admin-product-panel.component.html',
  styleUrl: './admin-product-panel.component.css',
  providers: [UserService, ProductoService]
})
export class AdminProductPanelComponent implements OnInit{

  productos: any[] = [];
  displayedProductos: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  categorias: any[] = [];
  errorMessage: string | null = null;
  searchQuery: string = '';
  baseUrl: string = 'https://donaclara.shop/api/public/images/uploads/';
  productoAEliminar: number | null = null;
  productoAHabilitar: number | null = null;
  private stock: number = 0;
  selectedProduct: any = {
    nombre: '',
    precio: '',
    cantidad: '',
    categoria: '',
    descripcion: '',
    imagen: ''
  };
  isFormValid: boolean = false;
  categoriasSeleccionadas: string[] = [];
  categoriasSeleccionadas2: string[] = [];
  producto: any = {
    nombre: '',
    precio: '',
    cantidad: '',
    categoria: '',
    descripcion: '',
    imagen: '',
    habilitado: ''
  };
  nuevaCategoria: string = '';
  sortState: number = 0;
  imagen: File | null = null;
  filtroAlfabeticoActivo: string | null = null;
  filtroPrecioActivo: string | null = null;
  fileUploaded: boolean = false;
  modalText: string = '';
  modalAction: string = '';
  selectedCategoriaId: number | null = null;
  totalPages: number = 0;

  
  
  
  

  
  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProductos();
    this.getCategorias();
  }

// Listar todos los productos
getProductos(): void {
  this.productoService.getProductos().subscribe(
    data => {
      // Filtrar productos habilitados y deshabilitados
      this.productos = data.sort((a: Producto, b: Producto) => {
        if (a.habilitado === b.habilitado) {
          return 0;
        } else if (a.habilitado) {
          return -1;
        } else {
          return 1;
        }

      });
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
  this.totalPages = Math.ceil(this.productos.length / this.itemsPerPage);
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

// Manejar la selección de la imagen
onFileSelected(event: any): void {
  if (event.target.files.length > 0) {
    this.imagen = event.target.files[0];
  }
}

// Subir la imagen
subirImagen(): void {
  if (this.imagen) {
    this.productoService.subirImagen(this.imagen).subscribe(
      response => {
        console.log('Imagen subida correctamente', response);
        this.selectedProduct.imagen = `${this.baseUrl}${response.nombreArchivo}`; // Guardar la ruta de la imagen
      },
      error => {
        console.error('Error al subir la imagen', error);
      }
    );
  } else {
    console.error('No se ha seleccionado ninguna imagen');
  }
}

// Agregar un producto
agregarProducto(): void {
  if (this.imagen) {
    this.productoService.subirImagen(this.imagen).subscribe(
      response => {
        console.log('Imagen subida correctamente', response);
        this.producto.imagen = response.nombreArchivo; // Guardar solo el nombre de la imagen
        this.productoService.agregarProducto(this.producto).subscribe(
          response => {
            console.log('Producto agregado correctamente', response);
            this.getProductos(); // Actualizar la lista de productos
            this.modalClose3(); // Cerrar el modal de agregar producto
          },
          error => {
            console.error('Error al agregar el producto', error);
          }
        );
      },
      error => {
        console.error('Error al subir la imagen', error);
      }
    );
  } else {
    console.error('No se ha seleccionado ninguna imagen');
  }
}

// Modificar un producto
modificarProducto(id: number, producto: any): void {
  this.productoService.modificarProducto(id, producto).subscribe(
    response => {
      console.log('Producto modificado correctamente', response);
      this.getProductos();
      this.modalClose4() // Actualizar la lista de productos
    },
    error => {
      console.error('Error al modificar el producto', error);
    }
  );
}

// Subir la imagen y luego modificar el producto
subirImagenYModificarProducto(): void {
  if (this.imagen) {
    this.productoService.subirImagen(this.imagen).subscribe(
      response => {
        console.log('Imagen subida correctamente', response);
        this.selectedProduct.imagen = response.nombreArchivo; // Guardar solo el nombre de la imagen
        this.modificarProducto(this.selectedProduct.id, this.selectedProduct); // Modificar el producto con el nuevo nombre de la imagen
        this.modalClose4(); // Cerrar el modal de modificar producto
      },
      error => {
        console.error('Error al subir la imagen', error);
      }
    );
  } else {
    this.modificarProducto(this.selectedProduct.id, this.selectedProduct);
    this.modalClose4(); // Cerrar el modal de modificar producto
  }
}

// Manejar el envío del formulario
onSubmit(): void {
  if (this.imagen) {
    this.subirImagenYModificarProducto();
  } else {
    this.modificarProducto(this.selectedProduct.id, this.selectedProduct);
  }
}

   // Buscar productos por una o más categorías
  buscarPorCategorias(categorias: string[]): void {
    this.productoService.buscarPorCategorias(categorias).subscribe(
      data => {
        this.productos = data;
      },
      error => {
        this.errorMessage = 'Error al buscar productos por categorías';
        console.error('Error al buscar productos por categorías', error);
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


  quitarProducto(id: number): void {
    this.productoAEliminar = id;
    // Aquí puedes abrir el modal si es necesario
  }

  habilitarProducto(id: number): void {
    this.productoAHabilitar = id;
    // Aquí puedes abrir el modal si es necesario
  }

  confirmarEliminarProducto(): void {
    if (this.productoAEliminar !== null) {
      this.productoService.quitarProducto(this.productoAEliminar).subscribe(
        response => {
          console.log('Producto eliminado exitosamente', response);
          this.productos = this.productos.filter(producto => producto.id !== this.productoAEliminar);
          this.productoAEliminar = null;
          this.modalClose2();
          this.getProductos();
        },
        error => {
          this.errorMessage = 'Error al eliminar el producto';
          console.error('Error al eliminar el producto', error);
        }
      );
    }
  }

  confirmarHabilitarProducto(): void {
    if (this.productoAHabilitar !== null) {
      this.productoService.habilitarProducto(this.productoAHabilitar).subscribe(
        response => {
          console.log('Producto habilitado exitosamente', response);
          const producto = this.productos.find(producto => producto.id === this.productoAHabilitar);
          if (producto) {
            producto.habilitado = true;
          }
          this.productoAHabilitar = null;
          this.modalClose2();
          this.getProductos();
        },
        error => {
          this.errorMessage = 'Error al habilitar el producto';
          console.error('Error al habilitar el producto', error);
        }
      );
    }
  }

  actualizarDestacado(id: number, destacado: boolean): void {
    this.productoService.actualizarDestacado(id, destacado).subscribe(
      response => {
        console.log('Estado de destacado actualizado exitosamente', response);
      },
      error => {
        this.errorMessage = 'Error al actualizar el estado de destacado';
        console.error('Error al actualizar el estado de destacado', error);
      }
    );
  }



  actualizarStock(productId: number, cantidad: number): void {
    this.stock = cantidad;
  }

  guardarStock(productId: number): void {
    this.productoService.actualizarStock(productId, this.stock).subscribe(
      response => {
        console.log('Stock actualizado exitosamente', response);
        const productoActualizado = this.productos.find(p => p.id === productId);
        if (productoActualizado) {
          productoActualizado.cantidad = this.stock;
        }
      },
      error => {
        this.errorMessage = 'Error al actualizar el stock';
        console.error('Error al actualizar el stock', error);
      }
    );
  }

  agregarCategoria(categoria: any): void {
    this.productoService.agregarCategoria(categoria).subscribe(
      response => {
        console.log('Categoría agregada exitosamente', response);
        window.location.reload();
      },
      error => {
        this.errorMessage = 'Error al agregar la categoría';
        console.error('Error al agregar la categoría', error);
      }
    );
  }

  borrarCategoria(id: number | null): void {
    if (id !== null) {
      // Buscar la categoría por su ID para verificar su nombre
      const categoria = this.categorias.find(categoria => categoria.id === id);
  
      if (categoria && categoria.nombre === 'Varios') {
        this.errorMessage = 'No se puede eliminar la categoría "Varios"';
        return;
      }
  
      this.productoService.borrarCategoria(id).subscribe(
        response => {
          console.log('Categoría borrada exitosamente', response);
          window.location.reload();
        },
        error => {
          if (error.status === 400 && error.error.message === 'No se puede eliminar la categoría "Varios"') {
            this.errorMessage = 'No se puede eliminar la categoría "Varios"';
          } else {
            this.errorMessage = 'Error al borrar la categoría';
          }
          console.error('Error al borrar la categoría', error);
        }
      );
    } else {
      this.errorMessage = 'Error al borrar la categoría';
    }
  }

  modalClose11(): void {
    const modal = document.getElementById('delete-category-modal') as HTMLElement;
    modal.style.display = 'none';
  }

  modal2(action?: string) {
    const modal = document.getElementById('deleteModal') as HTMLElement;
    const imageContainer = document.getElementById('modalImageContainer') as HTMLElement;
    modal.style.display = 'flex';
  
    if (action === 'habilitar') {
      this.modalText = 'Seguro quieres habilitar este producto?';
      this.modalAction = 'habilitar';
      imageContainer.innerHTML = `
        <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M4 4a2 2 0 1 0 0 4h16a2 2 0 1 0 0-4H4Zm0 6h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Zm10.707 5.707a1 1 0 0 0-1.414-1.414l-.293.293V12a1 1 0 1 0-2 0v2.586l-.293-.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l2-2Z" clip-rule="evenodd"/>
        </svg>`;
    } else {
      this.modalText = 'Seguro quieres deshabilitar este producto?';
      this.modalAction = 'eliminar';
      imageContainer.innerHTML = `
        <svg id="tachitoDeBasura" class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`;
    }
  }

  modalClose2() {
    const modal = document.getElementById('deleteModal') as HTMLElement;
    modal.style.display = 'none';
  }

  modalClose15() {
    const modal = document.getElementById('alert-container1.5') as HTMLElement;
    modal.style.display = 'none';
  }

  modal3(){
    const modal = document.getElementById('crud-modal') as HTMLElement;
    modal.style.display = 'flex';
  }

  modalClose3() {
    const modal = document.getElementById('crud-modal') as HTMLElement;
    modal.style.display = 'none';
  }

  openModal(producto: any): void {
    this.selectedProduct = { ...producto, categoria: this.getCategoriaModal(producto.categoria_id) };
    const modal = document.getElementById('modify-modal') as HTMLElement;
    modal.style.display = 'flex';
  }
  
  getCategoriaModal(categoria_id: number): string {
    const categoria = this.categorias.find(cat => cat.id === categoria_id);
    return categoria ? categoria.nombre : '';
  }

  modalClose4() {
    const modal = document.getElementById('modify-modal') as HTMLElement;
    modal.style.display = 'none';
  }

  
  checkFormValidity(): void {
    this.isFormValid = this.selectedProduct.nombre && this.selectedProduct.precio && this.selectedProduct.cantidad && this.selectedProduct.categoria;
  }

  limitDigits(event: any) {
    const input = event.target;
    if (input.value.length > 7) {
      input.value = input.value.slice(0, 7);
    }
    this.selectedProduct.precio = input.value;
  }

  isFormValidAdd(): boolean {
    return this.producto.nombre && this.producto.precio && this.producto.cantidad && this.producto.categoria;
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


modal5(): void {
  const modal = document.getElementById('create-category-modal');
  if (modal) {
    modal.style.display = 'block';
  }
}

modalClose5(): void {
  const modal = document.getElementById('create-category-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

modal11(): void {
  const modal = document.getElementById('delete-category-modal');
  if (modal) {
    modal.style.display = 'block';
  }
}

showAlert1() {
  setTimeout(() => {
    const modal = document.getElementById('alert-container1') as HTMLElement;
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
  }, 1000); // Wait for 1 second before executing the function
}

showAlert9() {
  setTimeout(() => {
    const modal = document.getElementById('alert-container1.5') as HTMLElement;
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
  }, 1000); // Wait for 1 second before executing the function
}

showAlert2() {
  setTimeout(() => {
    const modal = document.getElementById('alert-container2') as HTMLElement;
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
  }, 1000); // Wait for 1 second before executing the function
}

showAlert3() {
  setTimeout(() => {
    const modal = document.getElementById('alert-container3') as HTMLElement;
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
  }, 1000); // Wait for 1 second before executing the function
}

showAlert4() {
  setTimeout(() => {
    const modal = document.getElementById('alert-container4') as HTMLElement;
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
  }, 1000); // Wait for 1 second before executing the function
}

modalClose6() {
  const modal = document.getElementById('alert-container1') as HTMLElement;
  modal.style.display = 'none';
}
modalClose7() {
  const modal = document.getElementById('alert-container2') as HTMLElement;
  modal.style.display = 'none';
}
modalClose8() {
  const modal = document.getElementById('alert-container3') as HTMLElement;
  modal.style.display = 'none';
}
modalClose9() {
  const modal = document.getElementById('alert-container4') as HTMLElement;
  modal.style.display = 'none';
}
alertClose1() {
  const modal = document.getElementById('alert-container1.5') as HTMLElement;
  modal.style.display = 'none';
}



  // Aplicar filtros
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

  onFileSelectedImg(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileUploaded = true;
    }
  }

  modalProduct() {
    const modal = document.getElementById('container-modal3') as HTMLElement;
    modal.style.display = 'flex';
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

  showAlertD() {
    setTimeout(() => {
      const modal = document.getElementById('alert-containerD') as HTMLElement;
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
    }, 1000); // Wait for 1 second before executing the function
  }


  alertCloseD() {
    const modal = document.getElementById('alert-containerD') as HTMLElement;
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