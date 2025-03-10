import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Navbar3Component } from '../home/navbar3/navbar3.component';
import { FooterComponent } from '../home/footer/footer.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, Navbar3Component, FooterComponent],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
  providers: [CarritoService] // Añadir CarritoService a los proveedores
})
export class HistorialComponent implements OnInit {
  errorMessage: string | null = null;
  historiales: any[] = [];
  displayedHistoriales: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8; // Ajusta este valor según tus necesidades
  totalPages: number = 0;

  constructor(private carritoService: CarritoService, private router: Router) {} // Inyectar CarritoService

  ngOnInit(): void {
    this.getAllHistoriales();
  }

  getAllHistoriales(): void {
    this.carritoService.getAllHistoriales().subscribe(
      data => {
        this.historiales = data;
        this.updateDisplayedHistoriales(); // Actualizar los historiales mostrados
      },
      error => {
        this.errorMessage = 'Error al obtener los historiales';
        console.error('Error al obtener los historiales:', error);
      }
    );
  }

  cambiarEstado(idPedido: number, estado: string): void {
    this.carritoService.updateEstadoPedido(idPedido, estado).subscribe(
      response => {
        console.log('Estado actualizado:', response);
        this.getAllHistoriales(); // Recargar los historiales después de actualizar el estado
      },
      error => {
        console.error('Error al actualizar el estado:', error);
      }
    );
  }

  abrirPDF(pdfUrl: string): void {
    window.open(`http://localhost:8000/${pdfUrl}`, '_blank');
  }

  updateDisplayedHistoriales(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedHistoriales = this.historiales.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.historiales.length / this.itemsPerPage);
  }

  getPages(): number[] {
    if (this.totalPages <= 6) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else if (this.currentPage <= 3) {
      return [1, 2, 3, 4, 5, this.totalPages];
    } else if (this.currentPage >= this.totalPages - 2) {
      return [1, this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages];
    } else {
      return [1, this.currentPage - 2, this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2, this.totalPages];
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedHistoriales();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedHistoriales();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedHistoriales();
    }
  }
}