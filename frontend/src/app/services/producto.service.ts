import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  apiUrl = 'http://localhost:8000/api';  // Base URL de tu API

  constructor(private http: HttpClient) { }

  // Método para obtener el token desde localStorage
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Listar todos los productos
  getProductos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos`);
  }

  // Ver detalles de un producto
  getProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/${id}`);
  }

  // Buscar productos por una o más categorías
  buscarPorCategorias(categoriaNombres: string[]): Observable<any> {
    const categorias = categoriaNombres.join(',');
    return this.http.get<any>(`${this.apiUrl}/productos/categorias/${categorias}`);
  }

// Buscar productos por nombre
buscarPorNombre(nombre: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/productos/buscarPorNombre?nombre=${nombre}`);
}

  // Obtener todas las categorías
  getCategorias(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categorias`);
  }
  
  // Obtener los 10 productos más recientes
  getProductosRecientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recientes`);
  }

  // Agregar un producto (requiere token)
  agregarProducto(producto: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<any>(`${this.apiUrl}/agregar`, producto, { headers });
  }

  // Quitar un producto (requiere token)
  quitarProducto(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete<any>(`${this.apiUrl}/quitar/${id}`, { headers });
  }

  // Modificar un producto (requiere token)
  modificarProducto(id: number, producto: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.put<any>(`${this.apiUrl}/modificar/${id}`, producto, { headers });
  }

  // Actualizar el stock de un producto (requiere token)
  actualizarStock(id: number, cantidad: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.put<any>(`${this.apiUrl}/actualizar-stock/${id}`, { cantidad }, { headers });
  }

  // Agregar una categoría (requiere token)
  agregarCategoria(categoria: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<any>(`${this.apiUrl}/categorias`, categoria, { headers });
  }

  // Borrar una categoría (requiere token)
  borrarCategoria(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete<any>(`${this.apiUrl}/categorias/${id}`, { headers });
  }
}