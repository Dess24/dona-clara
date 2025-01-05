import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:8000/api'; // Cambia esto por la URL de tu API

  constructor(private http: HttpClient) { }


  // Agregar producto al carrito
  añadirProducto(productoId: number, cantidad: number): Observable<any> {
    const body = { producto_id: productoId, cantidad: cantidad };
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/carrito/add`, body, { headers });
  }

  // Ver el carrito
  verCarrito(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/carrito/view`, { headers });
  }

  // Pagar el carrito
  checkout(): Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/carrito/checkout`, {}, { headers, responseType: 'blob' });
}

  // Restar cantidad de un producto en el carrito
  restarProducto(productoId: number, cantidad: number): Observable<any> {
    const body = { producto_id: productoId, cantidad: cantidad };
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/restar-producto`, body, { headers });
  }

  eliminarProducto(productoId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const options = {
      headers: headers,
      body: { producto_id: productoId }
    };
    return this.http.delete(`${this.apiUrl}/carrito/eliminar`, options);
  }
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token'); // Obtén el token de autenticación desde el almacenamiento local
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  actualizarProducto(productoId: number, nuevaCantidad: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/carrito/actualizar-producto/${productoId}`, { cantidad: nuevaCantidad }, { headers });
  }

  getAllHistoriales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/historiales`);
  }
  

  getHistorialesByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/historiales/usuario/${userId}`);
  }

  updateEstadoPedido(idPedido: number, estado: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/historial/${idPedido}/estado`, { estado }, { headers });
  }
  
}

