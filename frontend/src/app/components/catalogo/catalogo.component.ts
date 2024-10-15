import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FooterComponent } from '../home/footer/footer.component';
import { ProductoService } from '../../services/producto.service';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
  providers: [ProductoService, UserService]
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];
  errorMessage: string | null = null;
  searchQuery: string = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProductos();
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

modalClose(){
  const modal = document.getElementById('container-modal') as HTMLElement;
  modal.style.display = 'none';
}
}
