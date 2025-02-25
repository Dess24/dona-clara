import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://localhost:8000/api'; // URL base de tu API

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

getUserInfo(): Observable<{ user: { admin: number } }> {
    const token = localStorage.getItem('auth_token');
    return this.http.get<{ user: { admin: number } }>(`${this.apiUrl}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Buscar usuarios por nombre, email, teléfono o domicilio
  buscarPorNombre(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar-usuarios`, { params: { query } });
  }

  // Borrar usuario por ID
  borrarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/borrar-usuario/${id}`);
  }

  // Obtener todos los usuarios
  getAllUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios`);
  }
  // Hacer admin a un usuario por ID
  makeAdmin(userId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.post(`${this.apiUrl}/make-admin`, { user_id: userId }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

   // Quitar admin a un usuario por ID
  removeAdmin(userId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.post(`${this.apiUrl}/remove-admin`, { user_id: userId }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }
  
  enviarMensaje(email: string, asunto: string, descripcion: string): Observable<any> {
    const body = { email: email, asunto: asunto, descripcion: descripcion };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/contactanos`, body, { headers });
  }

  generateResetCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-reset-code`, { email });
  }

  resetPassword(email: string, token: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, token, password, password_confirmation });
  }

// Ordenar usuarios
ordenarUsuarios(campo: string, orden: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/usuarios/ordenar`, { params: { campo, orden } });
}

  // Obtener todas las fotos del slider
  getFotosSlider(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fotos-slider`);
  }

  borrarImagenSlider(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/borrar-imagen-slider/${id}`);
  }

  subirImagenSlider(imagen: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('imagen', imagen);

    return this.http.post<any>(`${this.apiUrl}/imagenSlider`, formData, {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data' // No es necesario establecer este encabezado, Angular lo hace automáticamente
      })
    });
  }
}