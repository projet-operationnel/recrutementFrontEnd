import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRole = route.data['expectedRole']; // Rôle attendu pour accéder à la route
    const user = this.authService.getUser(); // Récupérer l'utilisateur connecté

    if (user && user.role === expectedRole) {
      return true; // Autoriser l'accès si le rôle correspond
    } else {
      this.router.navigate(['/home']); // Rediriger vers la page d'accueil si le rôle ne correspond pas
      return false;
    }
  }
}