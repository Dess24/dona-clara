import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  apiUrl = 'http://localhost:8000/api';  // Base URL de tu API

  constructor(private http: HttpClient) { }

  // Listar todos los productos
  getProductos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos`);
  }

  // Ver detalles de un producto
  getProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/${id}`);
  }

// Buscar productos por categoría
buscarPorCategoria(categoria: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/productos/categoria/${categoria}`);
}

  // Buscar productos por nombre
  buscarPorNombre(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/nombre/${nombre}`);
  }

  // Obtener todas las categorías
  getCategorias(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categorias`);
  }
}