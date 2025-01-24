import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';


@Injectable()
export class RoleInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.authService.isAuthenticate) {
      // Redirige vers la page de connexion si non authentifié
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('Utilisateur non authentifié'));
    }

    return this.authService.getRole('role').pipe(
      switchMap((role) => {
        // Redirige selon le rôle
        if (role === 'ADMIN') {
          this.router.navigate(['/administration']);
        } else if (role === 'CANDIDAT') {
          this.router.navigate(['/candidat']);
        }

        // Passe la requête au prochain handler
        return next.handle(req);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur de rôle ou d’accès : ', error);
        return throwError(() => error);
      })
    );
  }
}
