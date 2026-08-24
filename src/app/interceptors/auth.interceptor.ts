/**
 * @file auth.interceptor.ts
 * @description Interceptor que agrega el token JWT a todas las solicitudes HTTP.
 * Se aplica globalmente en la aplicación.
 */
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Nota: El frontend público normalmente no necesita autenticación.
  // Pero si el usuario está logueado en el panel admin, podemos pasar el token.
  const token = localStorage.getItem('uets_token');

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
