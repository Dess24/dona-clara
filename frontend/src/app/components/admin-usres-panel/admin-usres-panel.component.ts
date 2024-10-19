import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FooterComponent } from '../home/footer/footer.component';
import { ProductoService } from '../../services/producto.service';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-usres-panel',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './admin-usres-panel.component.html',
  styleUrl: './admin-usres-panel.component.css',
  providers: [UserService, ProductoService]
})
export class AdminUsresPanelComponent implements OnInit{

  @ViewChild('myText') myText!: ElementRef;
  @ViewChild('myCheckbox') myCheckbox!: ElementRef;
  productos: any[] = [];
  categorias: any[] = [];
  errorMessage: string | null = null;
  searchQuery: string = '';

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

  uncheckCheckbox() {
    this.myCheckbox.nativeElement.checked = false;
  }

  changeTextColor() {
    if (this.myText) {
      this.myText.nativeElement.style.color = 'rgb(17 24 39)';
      this.myText.nativeElement.style.textDecoration = 'none';
    }
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


toggleDropdown() {
  const dropdown = document.getElementById('dropdownSort1');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
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


onCheckboxChange(event: Event): void {
  const checkbox = event.target as HTMLInputElement;
  const adminText = document.getElementById('admin-text');
  if (adminText) {
    if (checkbox.checked) {
      adminText.style.color = 'rgb(20 83 45)',
      adminText.style.textDecoration = 'underline'; // Change to desired color
    } else {
      adminText.style.color = '';
      adminText.style.textDecoration = 'none'; // Revert to original color
    }
  }
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
  const modal = document.getElementById('sure-modal') as HTMLElement;
  modal.style.display = 'flex';
}

modalClose3() {
  const modal = document.getElementById('sure-modal') as HTMLElement;
  modal.style.display = 'none';
}



}