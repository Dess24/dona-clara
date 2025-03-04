import { Component, OnInit} from '@angular/core';
import { CarritoService } from '../../services/carrito.service'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule} from '@angular/router';
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
export class HistorialComponent implements OnInit{
  errorMessage: string | null = null;
  historiales: any[] = [];

  
  constructor(private carritoService: CarritoService, private router: Router) {} // Inyectar CarritoService

  ngOnInit(): void {
    this.getAllHistoriales();
  }

  getAllHistoriales(): void {
    this.carritoService.getAllHistoriales().subscribe(
      data => {
        this.historiales = data;
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


}


