import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FooterComponent } from '../home/footer/footer.component';
import { ProductoService } from '../../services/producto.service';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-product-panel',
  standalone: true,
  imports: [ NavbarComponent, FooterComponent, HttpClientModule, CommonModule, FormsModule ],
  templateUrl: './admin-product-panel.component.html',
  styleUrl: './admin-product-panel.component.css',
  providers: [UserService, ProductoService]
})
export class AdminProductPanelComponent implements OnInit{

  productos: any[] = [];
  categorias: any[] = [];
  errorMessage: string | null = null;
  searchQuery: string = '';
  baseUrl: string = 'http://localhost:8000/images/uploads/';
  productoAEliminar: number | null = null;
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
  producto: any = {
    nombre: '',
    precio: '',
    cantidad: '',
    categoria: '',
    descripcion: '',
    imagen: ''
  };
  nuevaCategoria: string = '';
  sortState: number = 0;
  imagen: File | null = null;
  filtroAlfabeticoActivo: string | null = null;
filtroPrecioActivo: string | null = null;
fileUploaded: boolean = false;

  
  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProductos();
    this.getCategorias();
    console.log('Valores de selectedProduct:', this.selectedProduct);
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

// Manejar la selección de la imagen
onFileSelected(event: any): void {
  if (event.target.files.length > 0) {
    this.imagen = event.target.files[0];
    this.subirImagen(); // Subir la imagen inmediatamente después de seleccionarla
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

  confirmarEliminarProducto(): void {
    if (this.productoAEliminar !== null) {
      this.productoService.quitarProducto(this.productoAEliminar).subscribe(
        response => {
          console.log('Producto eliminado exitosamente', response);
          // Eliminar el producto del array de productos
          this.productos = this.productos.filter(producto => producto.id !== this.productoAEliminar);
          this.productoAEliminar = null;
          this.modalClose2(); // Cerrar el modal
        },
        error => {
          this.errorMessage = 'Error al eliminar el producto';
          console.error('Error al eliminar el producto', error);
        }
      );
    }
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

  borrarCategoria(id: number): void {
    this.productoService.borrarCategoria(id).subscribe(
      response => {
        console.log('Categoría borrada exitosamente', response);
      },
      error => {
        this.errorMessage = 'Error al borrar la categoría';
        console.error('Error al borrar la categoría', error);
      }
    );
  }

  modal2(){
    const modal = document.getElementById('deleteModal') as HTMLElement;
    modal.style.display = 'flex';
  }

  modalClose2() {
    const modal = document.getElementById('deleteModal') as HTMLElement;
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
  }

  onFileSelectedImg(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileUploaded = true;
    }
  }


}