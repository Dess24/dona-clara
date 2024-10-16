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
  selectedProduct: any = {};
  isFormValid = false;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProductos();
    this.getCategorias();
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

  agregarProducto(producto: any): void {
    this.productoService.agregarProducto(producto).subscribe(
      response => {
        console.log('Producto agregado exitosamente', response);
      },
      error => {
        this.errorMessage = 'Error al agregar el producto';
        console.error('Error al agregar el producto', error);
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

  modificarProducto(id: number, producto: any): void {
    this.productoService.modificarProducto(id, producto).subscribe(
      response => {
        console.log('Producto modificado exitosamente', response);
        this.modalClose4();
        location.reload();
      },
      error => {
        this.errorMessage = 'Error al modificar el producto';
        console.error('Error al modificar el producto', error);
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
    this.selectedProduct = { ...producto };
    console.log('Producto seleccionado:', this.selectedProduct); // Imprimir en consola
    const modal = document.getElementById('modify-modal') as HTMLElement;
    modal.style.display = 'flex';
  }

  modalClose4() {
    const modal = document.getElementById('modify-modal') as HTMLElement;
    modal.style.display = 'none';
  }

  onSubmit(): void {
    this.modificarProducto(this.selectedProduct.id, this.selectedProduct);
  }
  
  checkFormValidity() {
    if (this.selectedProduct.precio !== null && this.selectedProduct.precio.toString().length > 7) {
      this.selectedProduct.precio = parseInt(this.selectedProduct.precio.toString().slice(0, 7), 10);
    }
    this.isFormValid = this.selectedProduct.nombre.trim() !== '' && this.selectedProduct.precio !== null && this.selectedProduct.precio <= 9999999;
  }

  limitDigits(event: any) {
    const input = event.target;
    if (input.value.length > 7) {
      input.value = input.value.slice(0, 7);
    }
    this.selectedProduct.precio = input.value;
  }
}