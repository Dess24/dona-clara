import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const getAuthHeaders = (): HttpHeaders => {
  const token = localStorage.getItem('auth_token'); // Obtén el token de autenticación desde el almacenamiento local
  return new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
};

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authHeaders = getAuthHeaders();

  const authReq = req.clone({
    setHeaders: authHeaders.keys().reduce((headers, key) => {
      headers[key] = authHeaders.get(key) || '';
      return headers;
    }, {} as { [name: string]: string }),
    url: `${environment.apiUrl}${req.url}` // Prepend the API URL from environment
  });

  return next(authReq);
};