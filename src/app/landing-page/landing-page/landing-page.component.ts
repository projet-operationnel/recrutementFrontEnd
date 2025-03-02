import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state-service.service';
import { AuthService } from '../../auth/service/auth.service';
import { AlertService } from '../../shared/services/Alert/alert.service';
import { finalize } from 'rxjs';

interface AnnouncementData {
  id: number;
  titre: string;
  description: string;
  datePublication: string;
  estActive: boolean;
  anneeAcademiqueId: number;
  anneeAcademiqueLibelle: string;

}

interface Announcement {
  message: null;
  data: AnnouncementData;
  status: boolean;
  statusCode: number;
  errors: null;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  isAuthenticated = false;
  userRole: string | null = null;
  announcements: Announcement[] = [];
  isLoading: boolean = false;

  constructor(private router: Router,private authStateServe:AuthStateService,private authService: AuthService,private alertService:AlertService) {}

  ngOnInit() {
    // Les annonces sont maintenant directement initialisées dans la propriété
    this.isAuthenticated = this.authService.isAuthenticate();
    this.userRole = this.authService.getUser()?.role || null;
    this.getAnnonce();
  }

    navigateToLogin() {
    if (this.isAuthenticated) {
      this.router.navigate(['/administration']);
    } else {
      this.authStateServe.setAuthState('login');
      this.router.navigate(['/auth']);
    }
  }


  getAnnonce(){
    this.authService.getData<Announcement[]>('annonces').subscribe({
      next: (response) => {
        this.announcements = response;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des annonces :', error);
      }
    })
  }

  navigateToRegister() {
    this.authStateServe.setAuthState('register');
    this.router.navigate(['/auth']);
  }

  navigateToApplication(announcementId: number): void {
    if (this.authService.isAuthenticate()) {
      // Rediriger vers la page de postulation avec l'ID de l'annonce
      this.router.navigate(['/apply', announcementId]);
    } else {
      // Rediriger vers la page de connexion avec un paramètre pour revenir après la connexion
      const returnUrl = encodeURIComponent(`/apply/${announcementId}`);
      this.router.navigate(['/auth'], { queryParams: { returnUrl } });
    }
  }

  logout(): void {
      this.alertService.showConfirmation("Déconnexion", "Voulez-vous vraiment vous déconnecter ?").then((result) => {
        if (result.isConfirmed) {  // Vérifiez si l'utilisateur a confirmé
          const token = this.authService.getToken();

          if (!token) {
            this.alertService.showAlert({
              title: "Erreur",
              text: "Token introuvable, déconnexion impossible",
              icon: "error"
            });
            return;
          }

          const data = {
            'token': token
          }

          this.isLoading = true;
          // Envoyez un objet vide comme données, le token sera dans le header
          this.authService.postData('logout', data).pipe(
            finalize(() => this.isLoading = false)
          ).subscribe({
            next: (response: any) => {
              if (response.statusCode === 200) {
                localStorage.clear();
                this.router.navigateByUrl('/auth');
              } else {
                this.alertService.showAlert({
                  title: "Erreur",
                  text: "La déconnexion a échoué",
                  icon: "error"
                });
              }
            },
            error: (error) => {
              console.log(error);
              this.alertService.showAlert({
                title: "Erreur",
                text: error.message || "Une erreur est survenue lors de la déconnexion",
                icon: "warning"
              });
            }
          });
        }
      });
  }

}
