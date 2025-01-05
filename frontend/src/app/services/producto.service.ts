import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Método para obtener el token desde localStorage
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Listar todos los productos
  getProductos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos`, {
      headers: new HttpHeaders({
        'Referer': 'https://donaclara.shop/'
      })
    });
  }

  // Ver detalles de un producto
  getProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/${id}`, {
      headers: new HttpHeaders({
        'Referer': 'https://donaclara.shop/'
      })
    });
  }

  // Buscar productos por una o más categorías
  buscarPorCategorias(categoriaNombres: string[]): Observable<any> {
    const categorias = categoriaNombres.join(',');
    return this.http.get<any>(`${this.apiUrl}/productos/categorias/${categorias}`, {
      headers: new HttpHeaders({
        'Referer': 'https://donaclara.shop/'
      })
    });
  }

  buscarPorNombre(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/nombre/${nombre}`, {
      headers: new HttpHeaders({
        'Referer': 'https://donaclara.shop/'
      })
    });
  }

  // Obtener todas las categorías
  getCategorias(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categorias`, {
      headers: new HttpHeaders({
        'Referer': 'https://donaclara.shop/'
      })
    });
  }
  
  // Obtener los 10 productos más recientes
  getProductosRecientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recientes`, {
      headers: new HttpHeaders({
        'Referer': 'https://donaclara.shop/'
      })
    });
  }

  // Quitar un producto (requiere token)
  quitarProducto(id: number): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('Referer', 'https://donaclara.shop/');
    return this.http.delete<any>(`${this.apiUrl}/quitar/${id}`, { headers });
  }

  // Habilitar un producto (requiere token)
  habilitarProducto(id: number): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('Referer', 'https://donaclara.shop/');
    return this.http.put<any>(`${this.apiUrl}/habilitar/${id}`, {}, { headers });
  }

  actualizarDestacado(id: number, destacado: boolean): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('Referer', 'https://donaclara.shop/');
    return this.http.put<any>(`${this.apiUrl}/actualizar-destacado/${id}`, { destacado }, { headers });
  }

  // Actualizar el stock de un producto (requiere token)
  actualizarStock(id: number, cantidad: number): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('Referer', 'https://donaclara.shop/');
    return this.http.put<any>(`${this.apiUrl}/actualizar-stock/${id}`, { cantidad }, { headers });
  }

  // Agregar una categoría (requiere token)
  agregarCategoria(categoria: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('Referer', 'https://donaclara.shop/');
    return this.http.post<any>(`${this.apiUrl}/create-categoria`, categoria, { headers });
  }

  // Borrar una categoría (requiere token)
  borrarCategoria(id: number): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('Referer', 'https://donaclara.shop/');
    return this.http.delete<any>(`${this.apiUrl}/delete-categoria/${id}`, { headers });
  }

  // Agregar un producto (requiere token)
  agregarProducto(producto: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('Referer', 'https://donaclara.shop/');
    return this.http.post<any>(`${this.apiUrl}/agregar`, producto, { headers });
  }

  // Modificar un producto (requiere token)
  modificarProducto(id: number, producto: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('Referer', 'https://donaclara.shop/');
    return this.http.put<any>(`${this.apiUrl}/modificar/${id}`, producto, { headers });
  }

  // Subir una imagen (requiere token)
  subirImagen(imagen: File): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('Referer', 'https://donaclara.shop/');
    const formData: FormData = new FormData();
    formData.append('imagen', imagen, imagen.name);
    return this.http.post<any>(`${this.apiUrl}/imagenes`, formData, { headers });
  }
}