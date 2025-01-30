// dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../../auth/service/auth.service';
import { AlertService } from '../../../shared/services/Alert/alert.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    // Sidebar animation
    trigger('sidebarAnimation', [
      state('open', style({
        transform: 'translateX(0)',
        width: '16rem'
      })),
      state('closed', style({
        transform: 'translateX(-100%)',
        width: '0'
      })),
      transition('open <=> closed', [
        animate('0.3s ease-in-out')
      ])
    ]),
    // Dropdown animation
    trigger('dropdownAnimation', [
      state('open', style({
        opacity: 1,
        transform: 'translateY(0)',
        visibility: 'visible'
      })),
      state('closed', style({
        opacity: 0,
        transform: 'translateY(-10px)',
        visibility: 'hidden'
      })),
      transition('open <=> closed', [
        animate('0.2s ease-in-out')
      ])
    ]),
    // Mobile menu animation
    trigger('mobileMenuAnimation', [
      state('open', style({
        opacity: 1,
        transform: 'translateY(0)',
        height: '*'
      })),
      state('closed', style({
        opacity: 0,
        transform: 'translateY(-10px)',
        height: '0'
      })),
      transition('open <=> closed', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class DashboardComponent {
  isLoading = false;
  isSidebarOpen = true;
  isMobileMenuOpen = false;
  isDropDownPanelOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isDropDownPanelOpen = false;
    }
  }

  toggleUserDropdown() {
    this.isDropDownPanelOpen = !this.isDropDownPanelOpen;
  }

  isActive(link: string): boolean {
    return this.router.isActive(link, true);
  }

   logout(): void {
  this.alertService.showConfirmation("Déconnexion", "Voulez-vous vraiment vous déconnecter ?").then((result) => {
    this.isLoading = true;
    const token = this.authService.getToken();
        if (!token) {
          this.alertService.showAlert({
            title: "Erreur",
            text: "Token introuvable, déconnexion impossible",
            icon: "error"
          });
          return;
        }
        this.authService.postData('logout', { token }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (value: any) => {
        if (value.status) {
                      localStorage.clear();
                      this.router.navigateByUrl('/auth');
          }
      },
      error: (error) => {
        this.alertService.showAlert({
                    title: "Erreur",
                    text: error.message,
                    icon: "warning"
                });
            }
    });
  })
    }

}
