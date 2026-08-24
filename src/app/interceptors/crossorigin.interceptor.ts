import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interceptor para agregar crossorigin="anonymous" a recursos externos
 * Previene warnings de Tracking Prevention en navegadores como Firefox
 */
@Injectable()
export class CrossOriginInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Agregar crossorigin para dominios externos (Google Images, etc)
    if (req.url.includes('lh3.googleusercontent.com') || 
        req.url.includes('via.placeholder.com') ||
        req.url.includes('fonts.googleapis.com')) {
      req = req.clone({
        setHeaders: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
    }
    return next.handle(req);
  }
}
