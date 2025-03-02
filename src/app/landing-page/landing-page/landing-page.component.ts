import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state-service.service';
import { AuthService } from '../../auth/service/auth.service';

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
  announcements: Announcement[] = [];

  constructor(private router: Router,private authStateServe:AuthStateService,private authService: AuthService) {}

  ngOnInit() {
    // Les annonces sont maintenant directement initialisées dans la propriété
    this.isAuthenticated = this.authService.isAuthenticate();
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

}